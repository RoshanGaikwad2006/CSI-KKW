import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cleanUser = String(username).trim();

  try {
    const db = await getTestDb();
    const results = db.collection("testresults");

    const existingResult = await results.findOne({ username: cleanUser });

    return res.status(200).json({ testCompleted: Boolean(existingResult) });
  } catch (err) {
    console.error("Check test status error:", err);
    return res.status(500).json({ error: "Failed to check test status" });
  }
}