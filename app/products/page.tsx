'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../components/AddToCartButton'
import { ObjectId } from 'mongodb'

interface ProductProps {
  _id: ObjectId
  name: string
  price: number
  category: string
  imageUrl: string
  inStock: boolean
  quantity: number
  description: string
}

interface ProductsResponse {
  products: ProductProps[]
  currentPage: number
  totalPages: number
}

const categories = ['All', 'Wine', 'Whiskey', 'Vodka', 'Gin', 'Rum']

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const fetchProducts = async (page: number, category: string) => {
    setLoading(true)
    try {
      const categoryQuery = category === 'All' ? '' : `&category=${encodeURIComponent(category)}`
      const response = await fetch(`/api/products?page=${page}&limit=12${categoryQuery}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load products. Please try again later.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory)
  }, [currentPage, selectedCategory])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Our Products</h1>
      
      {/* Category buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-blue-500 text-white dark:bg-blue-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id.toString()} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <Link href={`/products/${product._id}`} className="relative w-full pt-[100%]"> 
                <Image
                  src={product.imageUrl || '/placeholder.png'}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  className="object-cover"
                />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/products/${product._id}`}>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h2>
                </Link>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ksh {product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
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
      )}
      
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                currentPage === i + 1
                  ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}
