'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'

export default function CartIcon() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
        aria-label={`Shopping cart with ${itemCount} items`}
        aria-expanded={isOpen}
        aria-controls="cart-dropdown"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </button>
      {isOpen && itemCount > 0 && (
        <div 
          id="cart-dropdown"
          className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20"
          role="region"
          aria-label="Cart summary"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Cart Summary</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <li key={item._id.toString()} className="flex items-center space-x-2">
                  <Image
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-cover rounded"
                  />
                  <span className="flex-grow truncate">{item.name}</span>
                  <span className="text-gray-600">x{item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-2 border-t border-gray-200">
              <p className="font-semibold">Total: Ksh {total.toFixed(2)}</p>
            </div>
            <Link
              href="/cart"
              className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
