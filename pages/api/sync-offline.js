import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, offlineData } = req.body;

  if (!username || !offlineData) {
    return res.status(400).json({ error: "Username and offline data required" });
  }

  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("aptiuser");

    // Update or create draft with offline data
    await collection.updateOne(
      { username },
      { 
        $set: { 
          draft: offlineData,
          lastSync: new Date()
        } 
      },
      { upsert: true }
    );

    res.json({ success: true, message: "Offline data synced successfully" });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync offline data" });
  } finally {
    await client.close();
  }
}