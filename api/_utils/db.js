import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const dbn = process.env.MONGODB_NAME;
conn = null;
export default async () => {
  if (conn) return conn;
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = await client.db(dbn);
    console.log("Connected successfully to mongodb");
    return conn = db;
  } catch (err) {
    throw new Error(err);
  }
}