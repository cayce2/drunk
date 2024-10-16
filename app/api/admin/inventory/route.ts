//app/api/admin/inventoy/route.ts


import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
// import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('liquor_store')
    const products = await db.collection('products').find({}).toArray()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('liquor_store')
    const productData = await request.json()
    const result = await db.collection('products').insertOne(productData)
    return NextResponse.json({ success: true, productId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}