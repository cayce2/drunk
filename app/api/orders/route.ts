import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '../../../lib/mongodb'

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { items, total, shippingAddress } = await request.json()
    const client = await clientPromise
    const db = client.db('liquor_store')

    const result = await db.collection('orders').insertOne({
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ orderId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    const skip = (page - 1) * limit

    const orders = await db.collection('orders')
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection('orders').countDocuments({ userId })

    return NextResponse.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}