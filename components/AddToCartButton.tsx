'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { ObjectId } from 'mongodb'

// Ensure this matches the Product type in your MongoDB schema
interface Product {
    _id: ObjectId | string
  name: string
  price: number
  imageUrl: string
  inStock: boolean
  quantity: number
}

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export default function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({
      _id: product._id.toString(), // Convert ObjectId to string
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
    })
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1) // Reset quantity after adding to cart
    }, 500)
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-center mb-4 w-full">
        <button
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-l transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={disabled || isAdding}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1 select-none flex-grow text-center">
          {quantity}
        </span>
        <button
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-r transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
          disabled={disabled || isAdding || quantity >= product.quantity}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || quantity > product.quantity}
        className={`w-full px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          disabled || quantity > product.quantity
            ? 'bg-gray-400 cursor-not-allowed'
            : isAdding
            ? 'bg-green-500'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {disabled ? 'Out of Stock' : isAdding ? 'Added!' : quantity > product.quantity ? 'Not Enough Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}