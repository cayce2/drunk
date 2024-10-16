// Product type
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  }
  
  // Cart item type
  export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }
  
  // Order type
  export interface Order {
    _id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
      name: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  
  // User type
  export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  // API response types
  export interface ProductsResponse {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  }
  
  export interface OrdersResponse {
    orders: Order[];
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  }