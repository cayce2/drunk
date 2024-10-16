import { MongoClient, ObjectId } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Define interfaces
export interface Product {
  _id: ObjectId
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  inStock: boolean
  quantity: number
  featured: boolean
}

export interface OrderItem {
  _id: ObjectId
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  _id: ObjectId
  items: OrderItem[]
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    state?: string
    zip?: string
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
}