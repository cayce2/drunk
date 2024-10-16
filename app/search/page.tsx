// app/search/page.tsx

'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../../lib/mongodb'
import AddToCartButton from '../../components/AddToCartButton'

// Loading component for Suspense fallback
function Loading() {
  return <p className="text-center">Loading search results...</p>
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for {query}</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id.toString()} className="border rounded-lg overflow-hidden shadow-md">
              <Link href={`/products/${product._id.toString()}`}>
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl || '/placeholder.svg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain w-full h-48"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h2>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ksh {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-semibold ${
                    product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="mt-auto">
                  <AddToCartButton product={product} disabled={!product.inStock} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No products found matching your search.</p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchResults />
    </Suspense>
  )
}
