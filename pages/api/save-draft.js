import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    username,
    answers,
    flaggedQuestions,
    currentQuestion,
    timeSpent,
    violations,
    testStarted,
    questionIds,
    questions,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cleanUser = String(username).trim();

  try {
    const db = await getTestDb();
    const drafts = db.collection("draft");

    // Extract compact question IDs to prevent massive document bloat
    const finalQuestionIds =
      Array.isArray(questionIds) && questionIds.length > 0
        ? questionIds
        : Array.isArray(questions)
        ? questions.map((q) => q._id || q.id).filter(Boolean)
        : [];

    const updateDoc = {
      username: cleanUser,
      answers: answers || {},
      flaggedQuestions: flaggedQuestions || [],
      currentQuestion: currentQuestion || 0,
      timeSpent: timeSpent || 0,
      violations: violations || 0,
      testStarted: Boolean(testStarted),
      lastUpdated: new Date(),
    };

    if (finalQuestionIds.length > 0) {
      updateDoc.questionIds = finalQuestionIds;
    }

    // Upsert draft cleanly with atomic update
    await drafts.updateOne(
      { username: cleanUser },
      { $set: updateDoc },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Save draft error:", err);
    return res.status(500).json({ error: "Failed to save draft" });
  }
}