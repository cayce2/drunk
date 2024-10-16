//app/api/products/search/route.ts


import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    const products = await db.collection('products').find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).toArray()

    return NextResponse.json(products)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}