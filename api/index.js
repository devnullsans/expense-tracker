import dbc from './_db';

export default async (req, res) => {

  try {
    const db = await dbc();
    const collection = db.collection('expenses');
    const data = await collection.find({}).toArray();
    console.log('data', data);
    console.log('req.props', Object.getOwnPropertyNames(req));
    res.status(200).json({ message: 'Okay' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Sever Error' });
  }
}
