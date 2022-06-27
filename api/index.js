import dbc from './_db';
import { ObjectId } from 'mongodb';

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
        const { to } = req.query;
        return res.status(200).json({ data: await collection.find({ timestamp: { $gte: +to, $lte: +to + 864e5 } }, { sort: { timestamp: 1 } }).toArray() });
      }
      case 'POST': {
        const { expense } = req.body;
        return res.status(200).json({ data: await collection.insertOne(expense) });
      }
      case 'PUT': {
        const { id } = req.query;
        const { expense } = req.body;
        return res.status(200).json({ data: await collection.findOneAndUpdate({ _id: ObjectId(id) }, { $set: expense }) });
      }
      case 'DELETE': {
        const { id } = req.query;
        return res.status(200).json({ data: await collection.findOneAndDelete({ _id: ObjectId(id) }) });
      }
      default:
        return res.status(400).json({ message: 'HTTP Method not supported' });
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
