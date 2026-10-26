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
    revision,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cleanUser = String(username).trim();
  const incomingRevision = typeof revision === "number" ? revision : 1;

  try {
    const db = await getTestDb();
    const drafts = db.collection("draft");

    // Check existing draft for revision ordering protection
    const existingDraft = await drafts.findOne({ username: cleanUser });
    if (
      existingDraft &&
      typeof existingDraft.revision === "number" &&
      incomingRevision < existingDraft.revision
    ) {
      // Protect against out-of-order network arrival: an older request arrived after a newer one
      return res.status(200).json({
        success: true,
        staleIgnored: true,
        currentRevision: existingDraft.revision,
      });
    }

    // Extract compact question IDs to prevent massive document bloat
    const finalQuestionIds =
      Array.isArray(questionIds) && questionIds.length > 0
        ? questionIds
        : Array.isArray(questions)
        ? questions.map((q) => q._id || q.id).filter(Boolean)
        : [];

    const updateDoc = {
      username: cleanUser,
      answers: answers !== undefined ? answers : (existingDraft?.answers || {}),
      flaggedQuestions: flaggedQuestions !== undefined ? flaggedQuestions : (existingDraft?.flaggedQuestions || []),
      currentQuestion: currentQuestion !== undefined ? currentQuestion : (existingDraft?.currentQuestion || 0),
      timeSpent: timeSpent !== undefined ? timeSpent : (existingDraft?.timeSpent || 0),
      violations: violations !== undefined ? violations : (existingDraft?.violations || 0),
      testStarted: testStarted !== undefined ? Boolean(testStarted) : (existingDraft?.testStarted || false),
      revision: incomingRevision,
      lastUpdated: new Date(),
    };

    if (existingDraft?.category) {
      updateDoc.category = existingDraft.category;
    }

    // Record authoritative start time when test begins
    if (testStarted) {
      if (existingDraft && existingDraft.startTime) {
        updateDoc.startTime = existingDraft.startTime;
      } else {
        updateDoc.startTime = new Date();
      }
    }

    if (finalQuestionIds.length > 0) {
      updateDoc.questionIds = finalQuestionIds;
    }

    // Upsert draft cleanly with atomic update
    await drafts.updateOne(
      { username: cleanUser },
      {
        $set: updateDoc,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return res.status(200).json({ success: true, revision: incomingRevision });
  } catch (err) {
    console.error("Save draft error:", err);
    return res.status(500).json({ error: "Failed to save draft" });
  }
}