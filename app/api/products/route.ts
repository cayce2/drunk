import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    const skip = (page - 1) * limit

    const products = await db.collection<Product>('products')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection('products').countDocuments()

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category, imageUrl } = await request.json()
    const client = await clientPromise
    const db = client.db('liquor_store')

    const newProduct: Product = {
      name,
      description,
      price,
      category,
      imageUrl,
    }

    const result = await db.collection<Product>('products').insertOne(newProduct)

    return NextResponse.json({ productId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}