import dbc from './_db';

export default async (req, res) => {

  try {
    const db = await dbc();
    const collection = db.collection('expenses');
    const data = await collection.find({}).toArray();
    console.log('data', data);
    console.log('req.url', req.url);
    console.log('req.method', req.method);
    console.log('req.statusCode', req.statusCode);
    console.log('req.statusMessage', req.statusMessage);
    console.log('req.cookies', req.cookies);
    console.log('req.query', req.query);
    console.log('req.body', req.body);
    res.status(200).json({ message: 'Okay' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Sever Error' });
  }
}
/*
Connected successfully to mongodb
data []
req.props [
  'socket',
  'httpVersionMajor',
  'httpVersionMinor',
  'httpVersion',
  'complete',
  'rawHeaders',
  'rawTrailers',
  'aborted',
  'upgrade',
  'url',
  'method',
  'statusCode',
  'statusMessage',
  'client',
  'cookies',
  'query',
  'body'
]
*/