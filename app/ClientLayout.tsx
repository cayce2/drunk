'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun, ShoppingCart, Search } from 'lucide-react'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { useCart } from '../context/CartContext'

// Types
type MobileNavProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

type SearchOverlayProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

type HeaderActionsProps = {
  darkMode: boolean
  toggleDarkMode: () => void
  setSearchOpen: (isOpen: boolean) => void
}

type LayoutProps = {
  children: React.ReactNode
}

// Mobile Navigation Menu
const MobileNav: React.FC<MobileNavProps> = ({ isOpen, setIsOpen }) => {
  const { isSignedIn } = useUser()
  
  return (
    <div 
      className={`
        fixed inset-0 bg-gray-800 bg-opacity-95 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}
    >
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-white"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex flex-col items-center space-y-8 mt-8">
        <Link href="/" className="text-white text-xl" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link href="/products" className="text-white text-xl" onClick={() => setIsOpen(false)}>
          Products
        </Link>
        <Link href="/orders" className="text-white text-xl" onClick={() => setIsOpen(false)}>
          Orders
        </Link>
        {!isSignedIn && (
          <SignInButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-lg">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>
    </div>
  )
}

// Search Overlay
const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, setIsOpen }) => (
  <div 
    className={`
      fixed inset-0 bg-gray-800 bg-opacity-95 z-50 transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}
  >
    <div className="flex justify-end p-4">
      <button 
        onClick={() => setIsOpen(false)} 
        className="text-white"
        aria-label="Close search"
      >
        <X size={24} />
      </button>
    </div>
    <div className="container mx-auto px-4 mt-20">
      <input
        type="search"
        placeholder="Search products..."
        className="w-full px-6 py-4 text-xl rounded-lg bg-gray-100 dark:bg-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
    </div>
  </div>
)

// Cart Button
const CartButton: React.FC = () => {
  const { cart } = useCart()
  const cartItemsCount = cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                       flex items-center justify-center text-xs animate-pulse">
          {cartItemsCount}
        </span>
      )}
    </Link>
  )
}

// Header Actions
const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  setSearchOpen 
}) => {
  const { isSignedIn } = useUser()
  
  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => setSearchOpen(true)} 
        className="p-2"
        aria-label="Open search"
      >
        <Search className="h-6 w-6" />
      </button>
      <CartButton />
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal">
          <button className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white 
                           px-4 py-2 rounded-md text-sm font-medium">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  useEffect(() => {
    // Check for system preference and stored preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-gray-700"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/images/logo.png"
                alt="DRUNK by CAYCEE" 
                width={48}
                height={48}
                className="object-contain"
                priority
              />
              <span className="hidden md:block font-bold text-xl">Drunk by Caycee</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-gray-300 transition-colors">Products</Link>
              <Link href="/orders" className="hover:text-gray-300 transition-colors">Orders</Link>
            </nav>

            <HeaderActions 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              setSearchOpen={setIsSearchOpen}
            />
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <SearchOverlay isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-t 
                        dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <Image 
                src="/images/logo.png"
                alt="DRUNK by CAYCEE" 
                width={64}
                height={64}
                className="object-contain"
              />
              <p className="mt-4 max-w-xs">
                Your premium destination for exclusive spirits and cocktails.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/products">Products</Link></li>
                  <li><Link href="/orders">Orders</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>Email: contact@drunkbycaycee.com</li>
                  <li>Phone: (+254) 741-481 008</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t dark:border-gray-700 text-center">
            <p>© {new Date().getFullYear()} Drunk By Caycee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout