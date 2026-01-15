import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username } = req.query;
    
    await client.connect();
    const db = client.db("test");
    const testMetadata = db.collection("testmetadata");
    const results = db.collection("testresults");

    const activeTest = await testMetadata.findOne({ status: "active" });
    
    if (!activeTest) {
      return res.status(404).json({ error: "No active test found" });
    }

    // Check if user has already completed the test
    if (username) {
      const existingResult = await results.findOne({ username });
      if (existingResult) {
        return res.json({ ...activeTest, testCompleted: true });
      }
    }

    res.json({ ...activeTest, testCompleted: false });
  } catch (err) {
    console.error('Test metadata API error:', err);
    res.status(500).json({ error: "Failed to fetch test metadata" });
  } finally {
    await client.close();
  }
}