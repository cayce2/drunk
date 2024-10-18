# Liquor Store Project Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Key Components](#key-components)
5. [Authentication](#authentication)
6. [API Routes](#api-routes)
7. [Database](#database)
8. [State Management](#state-management)
9. [Styling](#styling)
10. [Deployment](#deployment)

## Introduction

The Liquor Store project is a full-stack e-commerce application built with Next.js, React, and MongoDB. It features user authentication, product browsing, shopping cart functionality, order management, and an admin interface.

## Project Setup

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/liquor-store.git
   cd liquor-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to view the application.

## Project Structure

The project follows the Next.js 13 App Router structure:

- `/app`: Contains the main application code
  - `/api`: API routes
  - `/products`: Product listing and detail pages
  - `/cart`: Shopping cart page
  - `/orders`: Order listing and tracking pages
  - `/admin`: Admin interface pages
- `/components`: Reusable React components
- `/context`: React context providers
- `/lib`: Utility functions and database connection
- `/public`: Static assets
- `/styles`: Global styles and Tailwind CSS configuration

## Key Components

### Navbar (`components/Navbar.tsx`)

The Navbar component provides navigation and authentication controls. It includes links to the product listing, orders (for authenticated users), the shopping cart, and sign-in/sign-out functionality.

### ProductCard (`components/ProductCard.tsx`)

The ProductCard component displays individual product information, including name, price, and an "Add to Cart" button.

### AddToCartButton (`components/AddToCartButton.tsx`)

This component handles adding products to the cart, including quantity selection.

### CartProvider (`context/CartContext.tsx`)

The CartProvider manages the shopping cart state across the application, providing functions to add, remove, and update cart items.

## Authentication

Authentication is handled using Clerk. The project uses Clerk's components and hooks for sign-in, sign-up, and user management.

Key files:
- `app/layout.tsx`: Wraps the application with the ClerkProvider
- `middleware.ts`: Defines protected routes and authentication rules

## API Routes

API routes are located in the `/app/api` directory:

- `/api/products`: Handles product listing and individual product retrieval
- `/api/orders`: Manages order creation and retrieval
- `/api/admin/orders`: Provides admin-specific order management functionality

## Database

The project uses MongoDB as its database. The database connection is managed in `lib/mongodb.ts`.

Key collections:
- `products`: Stores product information
- `orders`: Stores order information
- `users`: Managed by Clerk, but referenced in orders

## State Management

- Global state (e.g., shopping cart) is managed using React Context (`context/CartContext.tsx`)
- Local state is managed using React's `useState` hook in individual components

## Styling

The project uses Tailwind CSS for styling. Key files:
- `tailwind.config.js`: Tailwind configuration
- `app/globals.css`: Global styles and Tailwind directives

## Deployment

The project is designed to be deployed on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Connect your GitHub repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy the project

Remember to set up your production MongoDB instance and update the `MONGODB_URI` environment variable accordingly.
