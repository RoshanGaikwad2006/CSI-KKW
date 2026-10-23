import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, secretCode } = req.body;

  if (!username || !password || !secretCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();
  const cleanSecret = String(secretCode).trim();

  try {
    const db = await getTestDb();
    const testMetadata = db.collection("testmetadata");
    const users = db.collection("aptiuser");
    const results = db.collection("testresults");

    // Fetch active test metadata for dynamic secret code and schedule
    const activeTest = await testMetadata.findOne({ status: "active" });
    const expectedSecret = activeTest?.access?.secretCode || "K7M9X";

    // Allow the active test secretCode, or legacy code K7M9X/CSI2025 as fallback
    const validSecret =
      cleanSecret === expectedSecret ||
      cleanSecret === "K7M9X" ||
      cleanSecret === "CSI2025" ||
      (activeTest?.access?.batchSecretCodes && activeTest.access.batchSecretCodes[cleanSecret]);

    if (!validSecret) {
      return res.status(401).json({ error: "Invalid secret code. Please verify with lab invigilator." });
    }

    // Find student in aptiuser collection (case-insensitive for username convenience)
    const user = await users.findOne({
      username: { $regex: new RegExp(`^${cleanUser}$`, "i") },
      password: cleanPass,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if test was already submitted
    const existingResult = await results.findOne({ username: user.username });
    if (existingResult) {
      return res.status(403).json({
        error: "You have already completed and submitted this test.",
        alreadySubmitted: true,
      });
    }

    // Optional batch validation (flexible for 1, 2, or N batches)
    // If activeTest defines activeBatch, check user's batch
    if (activeTest?.access?.activeBatch && user.batch) {
      const activeBatch = String(activeTest.access.activeBatch).trim().toUpperCase();
      const userBatch = String(user.batch).trim().toUpperCase();
      if (activeBatch !== "ALL" && activeBatch !== userBatch) {
        return res.status(403).json({
          error: `Your batch (${user.batch}) is not scheduled for this slot. Currently active: Batch ${activeBatch}.`,
        });
      }
    }

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        name: user.name || user.username,
        lab: user.lab || "",
        batch: user.batch || "Default",
      },
    });
  } catch (err) {
    console.error("Auth API error:", err);
    res.status(500).json({ error: "Authentication service temporarily unavailable. Please retry." });
  }
}
