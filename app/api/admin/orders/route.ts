//app/api/admin/orders/route.ts


import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const status = searchParams.get('status')
  const searchTerm = searchParams.get('searchTerm')
  const dateFilter = searchParams.get('dateFilter')

  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (searchTerm) {
      query._id = { $regex: searchTerm, $options: 'i' }
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      query.createdAt = {
        $gte: filterDate,
        $lt: new Date(filterDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }

    const skip = (page - 1) * limit

    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection('orders').countDocuments(query)

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