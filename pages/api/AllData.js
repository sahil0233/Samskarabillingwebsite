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
  
    const db = await connectToDatabase(process.env.MONGODB_URI);
  
    try {
      // Access the selected collection and fetch its data
      const data1 = await db.collection('Polki').find({}).toArray();
      const data2 = await db.collection('Round').find({}).toArray();
      const combinedData = [...data1, ...data2];
      
      res.status(200).json({ combinedData });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
  }