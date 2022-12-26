import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
let conn = global.conn;
export default async () => {
  if (conn) {
    return conn;
  } else {
    const client = new MongoClient(uri);
    await client.connect();
    return (global.conn = conn = client.db("testsdb").collection("expenses"));
  }
};
