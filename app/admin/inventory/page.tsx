//app/admin/inventory/page.tsx


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { RefreshCw, Edit, Trash } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  quantity: number
  inStock: boolean
  imageUrl: string
}

export default function AdminInventory() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/admin/inventory')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateProductStock = async (productId: string, inStock: boolean, quantity: number) => {
    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inStock, quantity }),
      })

      if (response.ok) {
        fetchProducts()
      } else {
        throw new Error('Failed to update product stock')
      }
    } catch (error) {
      console.error('Error updating product stock:', error)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/admin/inventory/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        fetchProducts()
        setEditingProduct(null)
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">Loading inventory...</div>
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Inventory Management</h1>
        <button
          onClick={fetchProducts}
          disabled={refreshing}
          className="flex items-center bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
            <div className="p-4 flex flex-wrap justify-between items-center">
              <div className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center">
                <Image
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded object-cover mr-4"
                />
                <div>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">{product.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ksh {product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  product.inStock ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProductStock(product._id, product.inStock, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border rounded"
                  min="0"
                />
                <button
                  onClick={() => updateProductStock(product._id, !product.inStock, product.quantity)}
                  className={`px-2 py-1 text-xs rounded ${
                    product.inStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-1 text-blue-500 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
