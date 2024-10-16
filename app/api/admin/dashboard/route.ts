import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
//import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    // Fetch total orders
    const totalOrders = await db.collection('orders').countDocuments()

    // Fetch total products
    const totalProducts = await db.collection('products').countDocuments()

    // Fetch total revenue
    const revenueResult = await db.collection('orders').aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray()
    const totalRevenue = revenueResult[0]?.total || 0

    // Fetch total customers (unique customers from orders)
    const totalCustomers = await db.collection('orders').distinct('shippingAddress.name').then(customers => customers.length)

    // Fetch recent orders
    const recentOrders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        _id: 1,
        total: 1,
        status: 1,
        createdAt: 1,
        'shippingAddress.name': 1
      })
      .toArray()

    // Fetch sales data for the chart (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    const salesData = await db.collection('orders').aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    const labels = salesData.map(item => {
      const [year, month] = item._id.split('-')
      return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`
    })
    const data = salesData.map(item => item.total)

    // Fetch top 5 selling products
    const topProducts = await db.collection('orders').aggregate([
      { $unwind: '$items' },
      { $group: {
          _id: '$items._id',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]).toArray()

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalRevenue,
      totalCustomers,
      recentOrders: recentOrders.map(order => ({
        ...order,
        _id: order._id.toString(),
        customerName: order.shippingAddress.name
      })),
      salesData: {
        labels,
        datasets: [{
          label: 'Monthly Sales',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      },
      topProducts: topProducts.map(product => ({
        ...product,
        _id: product._id.toString()
      }))
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}