import db from './_utils/db';

export default async (req, res) => {

	try {
		const dbc = await db();
		const collection = dbc.collection('expenses');
    const data = await collection.find({}).toArray();
    console.log(data);
    console.log(req);
		res.status(200).json({ message: 'Okay' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Sever Error' });
	}
}
