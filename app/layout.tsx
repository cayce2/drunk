'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { CartProvider } from '../context/CartContext'
import CartIcon from '../components/CartIcon'
import Image from 'next/image'
import SearchBar from '../components/SearchBar'
import { Moon, Sun } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <title>Drunk by Caycee</title>
        <meta name="description" content="Your one-stop shop for premium liquors" />
      </head>
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <CartProvider>
          <header className="bg-silver-800 dark:bg-gray-800 text-black dark:text-white p-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <Link href="/" className="text-2xl font-bold mb-4 md:mb-0 dark:text-white">Drunk By Caycee</Link>
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <SearchBar />
              </div>
            </div>
            
            <div className="container mx-auto flex justify-between items-center mt-4">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logo.png"
                  alt="BLISS CHALICE" 
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </Link>
              <nav className="flex items-center">
                <ul className="flex space-x-4 items-center">
                  <li><Link href="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
                  <li><Link href="/products" className="hover:text-gray-300 transition-colors">Products</Link></li>
                  <li><Link href="/orders" className="hover:text-gray-300 transition-colors">Orders</Link></li>
                  <li>
                    <CartIcon />
                  </li>
                </ul>
                <button
                  onClick={toggleDarkMode}
                  className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </nav>
            </div>
          </header>

          <main>{children}</main>
         
          <footer className="bg-white-800 dark:bg-gray-800 text-black dark:text-white p-4 mt-8">
            <div className="container mx-auto text-center">
              © 2023 Liquor Store. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
