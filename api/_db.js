import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const dbn = process.env.MONGODB_NAME;
let num = global.num ?? 0;
let conn = global.conn;
export default async () => {
  console.log('num', num);
  if (conn) {
    console.log("mongodb connection cached");
    return conn;
  } else global.num = num += 1
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