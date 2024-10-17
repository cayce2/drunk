/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

type Order = {
  _id: string
  items: Array<{
    _id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  status: string
  createdAt: string
}

function OrderConfirmationPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders?orderId=${orderId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch order')
          }
          return res.json()
        })
        .then((data) => {
          setOrder(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching order:', err)
          setError('Failed to load order details. Please try again later.')
          setLoading(false)
        })
    }
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="text-center text-gray-700 dark:text-gray-300">Loading order details...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400">{error}</div>
  }

  if (!order) {
    return <div className="text-center text-gray-700 dark:text-gray-300">Order not found.</div>
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 no-print text-gray-800 dark:text-white">Order Confirmation</h1>

      <div className="bg-green-100 dark:bg-green-800 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200 p-4 mb-6 no-print">
        <p className="font-bold">Thank you for your order!</p>
        <p>Your order has been received and is being processed.</p>
      </div>

      <div className="mb-6" id="receipt">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="text-center mb-4">
            <img
              src="/images/logo.png"
              alt="Business Logo"
              className="mx-auto h-16"
            />
          </div>

          <h1 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">Drunk by Caycee</h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Order Receipt</p>
          
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Date:</strong> {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Status:</strong> {order.status}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Total:</strong> {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Items</h2>
            {order.items && order.items.length > 0 ? (
              <ul>
                {order.items.map((item) => (
                  <li key={item._id} className="flex justify-between items-center mb-2 text-gray-700 dark:text-gray-300">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No items found in this order.</p>
            )}
          </div>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Shipping Address</h2>
            <div className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress && (
                <>
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </>
              )}
            </div>
          </div>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Thank you for shopping with us!</p>
            <p>Contact us at support@drunkbycaycee.com</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-600 
                   dark:hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Print Receipt
        </button>

        <Link 
          href="/products" 
          className="text-blue-500 dark:text-blue-400 hover:underline text-center w-full sm:w-auto"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>}>
      <OrderConfirmationPageContent />
    </Suspense>
  )
}