//app/api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

interface Order {
  _id?: ObjectId;
  items: string[]; // Consider creating a more specific type for items
  total: number;
  shippingAddress: string; // Consider creating a specific type for addresses
  billingAddress: string;
  status: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    if (orderId) {
      // Fetch a single order
      const order = await db.collection<Order>('orders').findOne({ _id: new ObjectId(orderId) })
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    } else {
      // Fetch paginated orders
      const skip = (page - 1) * limit
      const orders = await db.collection<Order>('orders')
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await db.collection('orders').countDocuments()

      return NextResponse.json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      })
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items, total, shippingAddress, billingAddress } = await request.json()

    const client = await clientPromise
    const db = client.db('liquor_store')

    const newOrder: Order = {
      items,
      total,
      shippingAddress,
      billingAddress,
      status: 'pending', // Default status for new orders
      createdAt: new Date(),
    }

    const result = await db.collection<Order>('orders').insertOne(newOrder)

    return NextResponse.json({ orderId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}