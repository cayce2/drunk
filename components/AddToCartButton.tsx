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
    if (quantity > product.quantity) return; // Prevent adding if stock is not enough

    setIsAdding(true)
    addToCart({
      _id: product._id.toString(), // Convert ObjectId to string
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    })
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1) // Reset quantity after adding to cart
    }, 500)
  }

  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))
  const increaseQuantity = () => setQuantity(prev => Math.min(product.quantity, prev + 1))

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={decreaseQuantity}
          disabled={disabled || isAdding}
          aria-label="Decrease quantity"
          className="px-3 py-1 text-lg border border-gray-300 rounded-md"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={increaseQuantity}
          disabled={disabled || isAdding || quantity >= product.quantity}
          aria-label="Increase quantity"
          className="px-3 py-1 text-lg border border-gray-300 rounded-md"
        >
          +
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={disabled || quantity > product.quantity}
        className={`w-full px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          disabled || quantity > product.quantity
            ? 'bg-gray-400 cursor-not-allowed'
            : isAdding
            ? 'bg-green-500'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {disabled 
          ? 'Out of Stock' 
          : isAdding 
          ? 'Added!' 
          : quantity > product.quantity 
          ? 'Not Enough Stock' 
          : 'Add to Cart'}
      </button>
      
      {product.quantity > 0 && (
        <span className="text-sm text-gray-500">Available stock: {product.quantity}</span>
      )}
    </div>
  )
}
