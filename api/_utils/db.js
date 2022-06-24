import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbn = process.env.MONGODB_NAME;

let conn = null;

export default async () => {

	if (conn) return conn;

	try {
		const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		const db = await client.db(dbn);

		conn = db;
		return db;
	} catch (e) {
		throw new Error(e);
	}
}