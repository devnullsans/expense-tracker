import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const dbn = process.env.MONGODB_NAME;
let conn = global.conn;
export default async () => {
  if (conn) {
    console.log("mongodb connection cached");
    return conn;
  }
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = await client.db(dbn);
    console.log("mongodb connection fresh");
    return global.conn = conn = db;
  } catch (err) {
    throw new Error(err);
  }
}