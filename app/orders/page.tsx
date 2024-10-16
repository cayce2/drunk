//app/orders/page.tsx


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Order = {
  _id: string
  date: string
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered'
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async (page: number) => {
    try {
      const response = await fetch(`/api/orders?page=${page}&limit=5`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data.orders)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load orders. Please try again later.')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'Shipped':
        return 'text-blue-500 dark:text-blue-400'
      case 'Delivered':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
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
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order #{order._id}</h2>
                <span className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Date: {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Total: Ksh {order.total.toFixed(2)}</p>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Items:</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    {item.name} - Quantity: {item.quantity} - Ksh {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <Link 
                href={`/order-tracking/${order._id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Track Order
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}