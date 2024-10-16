'use client'

import { useState, useCallback, ReactNode } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Menu, X, LayoutDashboard, Clipboard, LucideIcon } from 'lucide-react'

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/add-product", icon: Package, label: "Products" },
  { href: "/admin/inventory", icon: Clipboard, label: "Inventory" },
]

const useSidebarToggle = (initialState: boolean = false): [boolean, () => void] => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  return [isOpen, toggle]
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, toggleSidebar] = useSidebarToggle()

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-10
        w-64 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out
      `}>
        <header className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Admin Panel</h1>
        </header>
        <nav className="mt-6" aria-label="Admin navigation">
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Link href={href} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {children}
      </main>
    </div>
  )
}
