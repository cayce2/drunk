//app/products//[id]/page.tsx

import Image from 'next/image';
import { ObjectId } from 'mongodb';
//import { useState } from 'react';
import { Star, Truck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
//import { Button } from '@/components/ui/button';
import clientPromise from '../../../lib/mongodb';
import AddToCartButton from '../../../components/AddToCartButton';

type ProductInternal = {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  quantity: number;
  rating: number;
  reviewCount: number;
  features: string[];
};

type ProductProps = Omit<ProductInternal, '_id'> & { _id: string };

async function getProduct(id: string): Promise<ProductInternal | null> {
  const client = await clientPromise;
  const db = client.db('liquor_store');
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

  if (product) {
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      quantity: product.quantity,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      features: product.features || [],
    } as ProductInternal;
  }

  return null;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const AvailabilityBadge = ({ inStock, quantity }: { inStock: boolean; quantity: number }) => {
  let color = 'bg-red-100 text-red-800';
  let text = 'Out of Stock';

  if (inStock) {
    if (quantity > 10) {
      color = 'bg-green-100 text-green-800';
      text = 'In Stock';
    } else {
      color = 'bg-yellow-100 text-yellow-800';
      text = 'Low Stock';
    }
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {text}
    </span>
  );
};

const RelatedProducts = () => {
  // This is a placeholder. In a real application, you'd fetch related products.
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="w-full h-32 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
            <p className="font-semibold">Related Product {i}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">$XX.XX</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Product not found. Please check the URL and try again.</AlertDescription>
      </Alert>
    );
  }

  const productForProps: ProductProps = {
    ...product,
    _id: product._id.toString(),
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-lg mt-8">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 mb-6 lg:mb-0">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={productForProps.imageUrl}
              alt={productForProps.name}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{productForProps.name}</h1>
            <AvailabilityBadge inStock={productForProps.inStock} quantity={productForProps.quantity} />
          </div>
          <div className="flex items-center mb-4">
            <p className="text-gray-600 dark:text-gray-300 mr-4">{productForProps.category}</p>
            <div className="flex items-center">
              <StarRating rating={productForProps.rating} />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                ({productForProps.rating.toFixed(1)}) {productForProps.reviewCount} reviews
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            Ksh {productForProps.price.toFixed(2)}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-6">{productForProps.description}</p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
              {productForProps.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-500" />
              <span className="text-sm">Free delivery</span>
            </div>
            {/*
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-sm">1-year warranty</span>
            </div>*/}
          </div>
          <div className="flex space-x-4 mb-6">
            <AddToCartButton product={{ ...productForProps, _id: new ObjectId(productForProps._id) }} />
            {/*
            <Button variant="outline" className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </Button>
            
            <Button variant="outline" className="flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            */}
          </div>
          
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
}