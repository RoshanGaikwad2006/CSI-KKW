// pages/api/login.js (Next.js API route)
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI"; // put your connection string in .env.local
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, secretCode } = req.body;

  if (!username || !password || !secretCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (secretCode !== "K7M9X") {
    return res.status(401).json({ error: "Invalid secret code" });
  }

  try {
    await client.connect();
    const db = client.db("test");
    const users = db.collection("aptiuser");

    const user = await users.findOne({ username, password });

    if (user) {
      res.json({ success: true, user: { username: user.username } });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication failed" });
  } finally {
    await client.close();
  }
}
