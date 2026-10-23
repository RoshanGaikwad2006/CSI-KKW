import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username } = req.query;

    const db = await getTestDb();
    const testMetadata = db.collection("testmetadata");
    const results = db.collection("testresults");

    const activeTest = await testMetadata.findOne({ status: "active" });

    if (!activeTest) {
      return res.status(404).json({ error: "No active test found" });
    }

    // Check if user has already completed the test
    if (username) {
      const cleanUser = String(username).trim();
      const existingResult = await results.findOne({ username: cleanUser });
      if (existingResult) {
        return res.status(200).json({ ...activeTest, testCompleted: true });
      }
    }

    return res.status(200).json({ ...activeTest, testCompleted: false });
  } catch (err) {
    console.error("Test metadata API error:", err);
    return res.status(500).json({ error: "Failed to fetch test metadata" });
  }
}