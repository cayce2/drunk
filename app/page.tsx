import Link from 'next/link'
import Image from 'next/image'
import { ObjectId } from 'mongodb'
import clientPromise from '../lib/mongodb'
import AddToCartButton from '../components/AddToCartButton'

export interface Product {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  quantity: number
  inStock: boolean
  featured: boolean
}

function serializeProduct(product: {
  _id: string | ObjectId,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl: string,
  quantity: number,
  inStock: boolean,
  featured: boolean
}): Product {
  return {
    _id: new ObjectId(product._id),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    quantity: product.quantity,
    inStock: product.inStock,
    featured: product.featured
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  const client = await clientPromise
  const db = client.db('liquor_store')
  const products = await db.collection('products').find({ featured: true }).toArray()
  return products.map(product => serializeProduct(product as Product))
}

async function getAllProducts(): Promise<Product[]> {
  const client = await clientPromise
  const db = client.db('liquor_store')
  const products = await db.collection('products').find({}).toArray()
  return products.map(product => serializeProduct(product as Product))
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product._id.toString()}`}>
        <div className="relative h-64 w-full flex justify-center bg-white dark:bg-gray-700">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="transition-opacity duration-300 hover:opacity-80"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Ksh {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
          <span className={`text-sm font-semibold ${
            product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <AddToCartButton product={product} disabled={!product.inStock} />
      </div>
    </div>
  )
}

export default async function Home() {
  let featuredProducts: Product[] = []
  let allProducts: Product[] = []
  let error: string | null = null

  try {
    [featuredProducts, allProducts] = await Promise.all([getFeaturedProducts(), getAllProducts()])
  } catch (e) {
    console.error('Error fetching products:', e)
    error = 'Failed to load products. Please try again later.'
  }

  return (
    <main className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Welcome to Our Liquor Store</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Featured Products</h2>
        {error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No featured products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All Products</h2>
        {error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : allProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}