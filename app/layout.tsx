import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import ClientLayout from './ClientLayout'
import { CartProvider } from '../context/CartContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Drunk by Caycee',
  description: 'Your one-stop shop for premium liquors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}