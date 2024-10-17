import clientPromise from '../lib/mongodb'

async function migrateOrders() {
  try {
    const client = await clientPromise
    const db = client.db('liquor_store')

    // Add userId field to all existing orders
    await db.collection('orders').updateMany(
      { userId: { $exists: false } },
      { $set: { userId: 'legacy_user' } }
    )

    // Create an index on the userId field
    await db.collection('orders').createIndex({ userId: 1 })

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    process.exit()
  }
}

migrateOrders()