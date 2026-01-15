const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    await client.connect();
    const db = client.db("test");
    const drafts = db.collection("draft");

    const draft = await drafts.findOne({ username });
    
    res.json({ draft });
  } catch (err) {
    console.error('Load draft error:', err);
    res.status(500).json({ error: 'Failed to load draft' });
  } finally {
    await client.close();
  }
}