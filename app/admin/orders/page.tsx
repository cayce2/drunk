//app/admin/orders/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Order } from '../../../lib/mongodb'
import { RefreshCw } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter, dateFilter])

  const fetchOrders = async () => {
    setRefreshing(true)
    try {
      const response = await fetch(`/api/admin/orders?page=${currentPage}&limit=10&status=${statusFilter}&searchTerm=${searchTerm}&dateFilter=${dateFilter}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalPages(data.totalPages)
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const toggleOrderDetails = (orderId: string) => {
    // Convert orderId to string for comparison
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  if (loading) {
    return <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">Loading orders...</div>
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Order Management</h1>
        <button
          onClick={fetchOrders}
          disabled={refreshing}
          className="flex items-center bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full sm:w-48 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full sm:w-24 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full sm:w-40 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id.toString()} className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
            <div className="p-4 flex flex-wrap justify-between items-center">
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Order ID: {order._id.toString()}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer: {order.shippingAddress.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total: Ksh {order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id.toString(), e.target.value)}
                  className="border rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => toggleOrderDetails(order._id.toString())}
                  className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  {expandedOrder === order._id.toString() ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            {expandedOrder === order._id.toString() && (
              <div className="px-4 pb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Order Items:</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id.toString()} className="flex items-center space-x-2">
                      <Image
                        src={item.imageUrl || '/placeholder.png'}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Price: Ksh {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}
