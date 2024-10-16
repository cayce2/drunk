'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FaSpinner } from 'react-icons/fa'

interface OrderStats {
  date: string;
  orders: number;
  revenue: number;
}

interface ApiResponse {
  orderStats: OrderStats[];
  totalRevenueToday: number;
}

export default function AdminDashboard() {
  const [orderStats, setOrderStats] = useState<OrderStats[]>([]);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await fetch('/api/admin/order-stats');
        if (response.ok) {
          const data: ApiResponse = await response.json();
          setOrderStats(data.orderStats);
          setTotalRevenueToday(data.totalRevenueToday); // Get total revenue from the response
        } else {
          throw new Error('Failed to fetch order stats');
        }
      } catch (error) {
        console.error('Error fetching order stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-blue-600 dark:text-white">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Overview of recent activities and stats.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Statistics Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Statistics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="orders" fill="#6366f1" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="revenue" fill="#34d399" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Revenue Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Todays Revenue</h2>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">Ksh {totalRevenueToday.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total revenue generated today.</p>
          </div>
        </div>

        {/* Additional Dashboard Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Card Example 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top-Selling Products</h3>
            <p className="text-gray-600 dark:text-gray-400">Display the top 5 products by revenue or units sold.</p>
          </div>

          {/* Card Example 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">Data on new vs. returning customers, regions, or demographics.</p>
          </div>

          {/* Card Example 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Orders</h3>
            <p className="text-gray-600 dark:text-gray-400">Overview of orders that are awaiting fulfillment or shipment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
