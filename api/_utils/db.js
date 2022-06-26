import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const dbn = process.env.MONGODB_NAME;
conn = null;
export default async () => {
	if (conn) return conn;
	try {
		const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		const db = await client.db(dbn);
		return conn = db;
	} catch (err) {
		throw new Error(err);
	}
}