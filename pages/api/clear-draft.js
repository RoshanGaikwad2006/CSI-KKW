import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cleanUser = String(username).trim();

  try {
    const db = await getTestDb();
    const drafts = db.collection("draft");

    await drafts.deleteOne({ username: cleanUser });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Clear draft error:", err);
    return res.status(500).json({ error: "Failed to clear draft" });
  }
}