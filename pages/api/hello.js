// Assuming you're using the native MongoDB driver
import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('Samskaradb');

  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  const { collectionName } = req.query; // Extract collection name from the query parameters

  if (!collectionName) {
    return res.status(400).json({ error: 'Collection name is required' });
  }

  const db = await connectToDatabase(process.env.MONGODB_URI);

  try {
    // Access the selected collection and fetch its data
    const data = await db.collection(collectionName).find({}).toArray();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}
