import { getTestDb } from "../../src/lib/testDb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, answers, timeSpent, violations, totalQuestions, questionIds, questions } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required for test submission" });
  }

  const cleanUser = String(username).trim();

  try {
    const db = await getTestDb();
    const results = db.collection("testresults");
    const drafts = db.collection("draft");
    const tests = db.collection("tests");

    // Check if user already submitted
    const existingResult = await results.findOne({ username: cleanUser });
    if (existingResult) {
      return res.status(200).json({
        success: true,
        alreadySubmitted: true,
        message: "Test already submitted previously",
        score: existingResult.score,
        totalQuestions: existingResult.totalQuestions,
      });
    }

    // Determine question IDs presented to student
    let finalQuestionIds = Array.isArray(questionIds) && questionIds.length > 0 ? questionIds : [];

    // Fallback: If not provided in body, check student's draft in database
    if (finalQuestionIds.length === 0) {
      const draft = await drafts.findOne({ username: cleanUser });
      if (draft && Array.isArray(draft.questionIds) && draft.questionIds.length > 0) {
        finalQuestionIds = draft.questionIds;
      }
    }

    // Fetch genuine questions directly from database tests collection
    let realQuestions = [];
    if (finalQuestionIds.length > 0) {
      const objectIds = finalQuestionIds
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));
      realQuestions = await tests.find({ _id: { $in: objectIds } }).toArray();
    }

    const qMap = new Map();
    realQuestions.forEach((q) => qMap.set(q._id.toString(), q));

    // Calculate score accurately and securely on the server
    let correctAnswers = 0;
    const answerBreakdown = [];
    const submittedAnswers = answers || {};

    if (finalQuestionIds.length > 0) {
      finalQuestionIds.forEach((qId, index) => {
        const realQ = qMap.get(qId);
        const userAnswer = submittedAnswers[index] !== undefined ? submittedAnswers[index] : submittedAnswers[qId];
        const correctAnswer = realQ?.correctAnswer || "";

        const isCorrect = Boolean(
          userAnswer &&
            correctAnswer &&
            String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()
        );

        if (isCorrect) {
          correctAnswers++;
        }

        answerBreakdown.push({
          index,
          questionId: qId,
          userAnswer: userAnswer || null,
          correctAnswer,
          isCorrect,
        });
      });
    } else if (Array.isArray(questions) && questions.length > 0) {
      // Fallback for legacy client payloads
      questions.forEach((q, index) => {
        const userAnswer = submittedAnswers[index];
        const correctAnswer = q.correctAnswer;
        const isCorrect = Boolean(
          userAnswer &&
            correctAnswer &&
            String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()
        );
        if (isCorrect) correctAnswers++;
        answerBreakdown.push({
          index,
          userAnswer: userAnswer || null,
          correctAnswer,
          isCorrect,
        });
      });
    }

    const finalTotal =
      finalQuestionIds.length || (questions && questions.length) || totalQuestions || Object.keys(submittedAnswers).length;

    const testResult = {
      username: cleanUser,
      answers: submittedAnswers,
      timeSpent: timeSpent || 0,
      violations: violations || 0,
      totalQuestions: finalTotal,
      score: correctAnswers,
      submittedAt: new Date(),
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
      answerBreakdown,
    };

    // Save final result to MongoDB testresults collection
    await results.insertOne(testResult);

    // Clean up draft now that test is officially completed
    await drafts.deleteOne({ username: cleanUser }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Test submitted and graded successfully",
      score: correctAnswers,
      totalQuestions: finalTotal,
    });
  } catch (err) {
    console.error("Submit test API error:", err);
    return res.status(500).json({ error: "Failed to record test submission. Please retry." });
  }
}