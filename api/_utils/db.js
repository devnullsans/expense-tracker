import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
let conn = global.conn;
export default async () => {
  if (conn) {
    return conn;
  }
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return global.conn = conn = client.db('testsdb');
  } catch (err) {
    throw new Error(err);
  }
}
