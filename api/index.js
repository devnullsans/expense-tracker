import dbc from './_db';

export default async (req, res) => {

  try {
    const db = await dbc();
    const collection = db.collection('expenses');
    console.log('req.url', req.url);
    console.log('req.method', req.method);
    console.log('req.cookies', req.cookies);
    console.log('req.query', req.query);
    console.log('req.body', req.body);
    switch (req.method) {
      case 'GET': {
        return res.status(200).json({ data: await collection.find({}).toArray() });
      }
      case 'POST': {
				const { expense } = body;
				return res.status(200).json({ data: await collection.insertOne(expense) });
			}
      default:
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Sever Error' });
  }
}
/*
Connected successfully to mongodb
data []
req.url /api
req.method GET
req.cookies {}
req.query [Object: null prototype] {}
req.body undefined
*/