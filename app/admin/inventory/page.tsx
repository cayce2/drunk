'use client'

import { useState, useEffect } from 'react'
//import { useRouter } from "next/navigation"
import Image from 'next/image'
import { RefreshCw, Edit, Trash, Plus, Search } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  _id: string
  name: string
  description?: string
  price: number
  quantity: number
  category?: string
  inStock: boolean
  imageUrl: string
}

interface AddProductFormData {
  name: string
  description: string
  price: string
  category: string
  imageUrl: string
  quantity: string
}

const StockBadge = ({ inStock }: { inStock: boolean }) => (
  <Badge 
    variant={inStock ? "secondary" : "destructive"}
    className={inStock ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100" : ""}
  >
    {inStock ? 'In Stock' : 'Out of Stock'}
  </Badge>
)

export default function AdminInventory() {
//  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addProductFormData, setAddProductFormData] = useState<AddProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    quantity: '0'
  })
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/admin/inventory')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleAddProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setAddProductFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addProductFormData,
          price: parseFloat(addProductFormData.price),
          quantity: parseInt(addProductFormData.quantity),
          inStock: parseInt(addProductFormData.quantity) > 0
        }),
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Product added successfully!' })
        setAddProductFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          quantity: '0'
        })
        fetchProducts()
        setTimeout(() => {
          setIsAddModalOpen(false)
          setAlert(null)
        }, 2000)
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setAlert({ 
        type: 'error', 
        message: 'There was an error creating the product. Please try again.' 
      })
    }
  }

  const updateProductStock = async (productId: string, inStock: boolean, quantity: number) => {
    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inStock, quantity }),
      })

      if (response.ok) {
        fetchProducts()
      } else {
        throw new Error('Failed to update product stock')
      }
    } catch (error) {
      console.error('Error updating product stock:', error)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/admin/inventory/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        fetchProducts()
        setEditingProduct(null)
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const compareValue = (a: any, b: any) => {
        if (sortOrder === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1
        }
        return a[sortBy] < b[sortBy] ? 1 : -1
      }
      return compareValue(a, b)
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory Management</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={fetchProducts}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'price' | 'quantity') => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.imageUrl || '/placeholder.svg'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>Ksh {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <StockBadge inStock={product.inStock} />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProductStock(product._id, product.inStock, parseInt(e.target.value))}
                        className="w-20"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateProductStock(product._id, !product.inStock, product.quantity)}
                        >
                          {product.inStock ? 'Mark Out' : 'Mark In'}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            {alert && (
              <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={addProductFormData.name}
                  onChange={handleAddProductInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={addProductFormData.description}
                  onChange={handleAddProductInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="text-sm font-medium">
                    Price
                  </label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    value={addProductFormData.price}
                    onChange={handleAddProductInputChange}
                    placeholder="Enter price"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={addProductFormData.quantity}
                    onChange={handleAddProductInputChange}
                    placeholder="Enter quantity"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  name="category"
                  value={addProductFormData.category}
                  onChange={handleAddProductInputChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={addProductFormData.imageUrl} onChange={handleAddProductInputChange} 
                  placeholder="Enter image URL" required /> 
                  </div> 
                  </div> 
                    <DialogFooter> 
                      <Button type="submit">Add Product</Button> 
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}> Cancel </Button> 
                      </DialogFooter> </form> </DialogContent> </Dialog>
                    {/* Edit Product Modal */}
                    {editingProduct && (
                      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="name" className="text-sm font-medium">
                                  Product Name
                                </label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={editingProduct.name}
                                  onChange={(e) =>
                                    setEditingProduct((prev) =>
                                      prev ? { ...prev, name: e.target.value } : prev
                                    )
                                  }
                                  placeholder="Enter product name"
                                  required
                                />
                              </div>
                  
                              <div>
                                <label htmlFor="description" className="text-sm font-medium">
                                  Description
                                </label>
                                <Textarea
                                  id="description"
                                  name="description"
                                  value={editingProduct.description}
                                  onChange={(e) =>
                                    setEditingProduct((prev) =>
                                      prev ? { ...prev, description: e.target.value } : prev
                                    )
                                  }
                                  placeholder="Enter product description"
                                  required
                                />
                              </div>
                  
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label htmlFor="price" className="text-sm font-medium">
                                    Price
                                  </label>
                                  <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={editingProduct.price}
                                    onChange={(e) =>
                                      setEditingProduct((prev) =>
                                        prev ? { ...prev, price: parseFloat(e.target.value) } : prev
                                      )
                                    }
                                    placeholder="Enter price"
                                    step="0.01"
                                    required
                                  />
                                </div>
                  
                                <div>
                                  <label htmlFor="quantity" className="text-sm font-medium">
                                    Quantity
                                  </label>
                                  <Input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={editingProduct.quantity}
                                    onChange={(e) =>
                                      setEditingProduct((prev) =>
                                        prev ? { ...prev, quantity: parseInt(e.target.value) } : prev
                                      )
                                    }
                                    placeholder="Enter quantity"
                                    min="0"
                                    required
                                  />
                                </div>
                              </div>
                  
                              <div>
                                <label htmlFor="category" className="text-sm font-medium">
                                  Category
                                </label>
                                <Input
                                  id="category"
                                  name="category"
                                  value={editingProduct.category || ''}
                                  onChange={(e) =>
                                    setEditingProduct((prev) =>
                                      prev ? { ...prev, category: e.target.value } : prev
                                    )
                                  }
                                  placeholder="Enter category"
                                  required
                                />
                              </div>
                  
                              <div>
                                <label htmlFor="imageUrl" className="text-sm font-medium">
                                  Image URL
                                </label>
                                <Input
                                  type="url"
                                  id="imageUrl"
                                  name="imageUrl"
                                  value={editingProduct.imageUrl}
                                  onChange={(e) =>
                                    setEditingProduct((prev) =>
                                      prev ? { ...prev, imageUrl: e.target.value } : prev
                                    )
                                  }
                                  placeholder="Enter image URL"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Changes</Button>
                              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                Cancel
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  ) }
                  
                  
                  
                  
                  
                  
                  