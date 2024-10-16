import { NextResponse } from 'next/server'
import clientPromise from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const client = await clientPromise
    const db = client.db('liquor_store')

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order status updated successfully' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}