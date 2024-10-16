//app/order-tracking/page.tsx


'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

type OrderItem = {
  _id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

type Order = {
  _id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  estimatedDeliveryDate?: string
}

const statusSteps: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered']

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          setError('Failed to fetch order')
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('An error occurred while fetching the order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error || !order) {
    return <div className="text-center py-8 text-red-500">{error || 'Order not found'}</div>
  }

  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Order Tracking</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Order Details</h2>
          <p className="text-gray-600 dark:text-gray-300">Order ID: {order._id}</p>
          <p className="text-gray-600 dark:text-gray-300">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="text-gray-600 dark:text-gray-300">Total: Ksh {order.total.toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-300">Status: {order.status}</p>
          {order.trackingNumber && (
            <p className="text-gray-600 dark:text-gray-300">Tracking Number: {order.trackingNumber}</p>
          )}
          {order.estimatedDeliveryDate && (
            <p className="text-gray-600 dark:text-gray-300">
              Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Shipping Address</h3>
          <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.address}</p>
          <p className="text-gray-600 dark:text-gray-300">
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.country}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Order Status</h3>
          <div className="flex items-center space-x-4">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center space-x-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quantity: {item.quantity} | Price: Ksh {item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}