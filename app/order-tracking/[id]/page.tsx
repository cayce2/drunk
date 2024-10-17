'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Types
type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered'

type Order = {
  _id: string
  status: OrderStatus
  estimatedDelivery: string
  trackingNumber: string
}

// Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
    <p className="text-red-500 dark:text-red-400">{message}</p>
    <ReturnLink />
  </div>
)

const ReturnLink = () => (
  <Link href="/orders" className="text-blue-500 hover:underline mt-4 inline-block">
    Return to Orders
  </Link>
)

const OrderNotFound = () => (
  <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
    <p>We couldn&#39;t find the order you&#39;re looking for.</p>
    <ReturnLink />
  </div>
)

const ProgressBar = () => (
  <div className="relative pt-1">
    <div className="flex mb-2 items-center justify-between">
      <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-800">
        Progress
      </div>
    </div>
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-800">
      <div style={{ width: "50%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
    </div>
  </div>
)

const StatusColor = {
  Processing: 'text-yellow-500 dark:text-yellow-400',
  Shipped: 'text-blue-500 dark:text-blue-400',
  'Out for Delivery': 'text-purple-500 dark:text-purple-400',
  Delivered: 'text-green-500 dark:text-green-400'
} as const

const OrderDetails = ({ order }: { order: Order }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Order #{order._id}</h2>
    <p className="mb-2">
      Status: <span className={`font-medium ${StatusColor[order.status]}`}>{order.status}</span>
    </p>
    <p className="mb-2">
      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
    </p>
    <p className="mb-4">Tracking Number: {order.trackingNumber}</p>
    <ProgressBar />
  </div>
)

// Custom hook for fetching order
const useOrderData = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError('Failed to load order details. Please try again later.')
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return { order, loading, error }
}

// Main component
export default function OrderTrackingPage() {
  const params = useParams()
  const { order, loading, error } = useOrderData(params.id as string)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!order) return <OrderNotFound />

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
      <OrderDetails order={order} />
      <ReturnLink />
    </div>
  )
}