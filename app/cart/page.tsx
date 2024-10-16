'use client'

import { useCart } from '../../context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { FaTrashAlt } from 'react-icons/fa' // Import trash icon

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          <Link href="/products" className="text-blue-500 dark:text-blue-400 hover:underline text-lg">Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {cart.map((product) => (
              <div key={product._id.toString()} className="flex flex-col sm:flex-row items-center sm:justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-l font-semibold text-gray-800 dark:text-white">{product.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">Ksh {product.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center justify-between w-full sm:w-auto space-x-4">
                  <div className="flex items-center border rounded dark:border-gray-600">
                    <button
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
                      onClick={() => updateQuantity(product._id.toString(), product.quantity - 1)} // Convert ObjectId to string
                    >
                      -
                    </button>
                    <span className="px-2 py-2 text-gray-800 dark:text-white">{product.quantity}</span>
                    <button
                      className="px-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
                      onClick={() => updateQuantity(product._id.toString(), product.quantity + 1)} // Convert ObjectId to string
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    onClick={() => removeFromCart(product._id.toString())} // Convert ObjectId to string
                  >
                    <FaTrashAlt /> {/* Trash icon */}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <p className="text-2xl font-bold text-right text-gray-800 dark:text-white">Total: Ksh {total.toFixed(2)}</p>
            <div className="mt-4 flex justify-end space-x-4">
              <Link
                href="/checkout"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
