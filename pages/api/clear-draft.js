const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    await client.connect();
    const db = client.db("test");
    const drafts = db.collection("draft");

    await drafts.deleteOne({ username });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Clear draft error:', err);
    res.status(500).json({ error: 'Failed to clear draft' });
  } finally {
    await client.close();
  }
}