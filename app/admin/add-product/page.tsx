//app/admin/add-product/page.tsx


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  })
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Product added successfully!' })
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setAlert({ type: 'error', message: 'There was an error creating the product. Please try again.' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h1>
      {alert && (
        <div
          className={`mb-4 p-4 rounded-md ${
            alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          role="alert"
        >
          <p className="font-medium">{alert.message}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}