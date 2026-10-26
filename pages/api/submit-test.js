import { getTestDb } from "../../src/lib/testDb";
import { ObjectId } from "mongodb";

let questionMapPromise = null;
let questionCacheTime = 0;

function getQuestionMap(testsCol) {
  const now = Date.now();
  if (questionMapPromise && now - questionCacheTime < 60000) {
    return questionMapPromise;
  }
  questionMapPromise = testsCol
    .find({}, { projection: { _id: 1, correctAnswer: 1 } })
    .toArray()
    .then((allDocs) => {
      const map = new Map();
      allDocs.forEach((d) => map.set(d._id.toString(), d));
      return map;
    })
    .catch((err) => {
      questionMapPromise = null;
      throw err;
    });
  questionCacheTime = now;
  return questionMapPromise;
}

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

    // Load active test metadata for authoritative schedule enforcement
    const testMetadataCol = db.collection("testmetadata");
    const activeTest = await testMetadataCol.findOne({ status: "active" });
    const configuredDuration = activeTest?.schedule?.duration || activeTest?.config?.duration || 3600;
    const configuredBuffer = activeTest?.schedule?.bufferTime || 300; // 5 min grace tolerance for network transmission
    const maxAllowedElapsed = configuredDuration + configuredBuffer;

    // Fetch student's draft for authoritative start time and question assignment
    const candidateDraft = await drafts.findOne({ username: cleanUser });

    // Determine authoritative timeSpent
    let verifiedTimeSpent = Number(timeSpent) || 0;
    let timingStatus = "normal";

    if (candidateDraft && (candidateDraft.startTime || candidateDraft.createdAt)) {
      const serverStartTime = new Date(candidateDraft.startTime || candidateDraft.createdAt).getTime();
      const serverElapsed = Math.max(0, Math.floor((Date.now() - serverStartTime) / 1000));
      // Cap at configured duration + buffer
      verifiedTimeSpent = Math.min(serverElapsed, maxAllowedElapsed);
      if (serverElapsed > maxAllowedElapsed) {
        timingStatus = "deadline_exceeded";
      }
    } else {
      verifiedTimeSpent = Math.min(Math.max(0, verifiedTimeSpent), maxAllowedElapsed);
    }

    // Determine question IDs presented to student
    let finalQuestionIds = Array.isArray(questionIds) && questionIds.length > 0 ? questionIds : [];

    // Fallback: If not provided in body, check student's draft in database
    if (finalQuestionIds.length === 0 && candidateDraft && Array.isArray(candidateDraft.questionIds) && candidateDraft.questionIds.length > 0) {
      finalQuestionIds = candidateDraft.questionIds;
    }

    // Fetch question map using high-performance in-memory cache (eliminates 120 concurrent Atlas lookups)
    const qMap = await getQuestionMap(tests);

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

    // Look up student profile from aptiuser to enrich result document
    const usersCol = db.collection("aptiuser");
    let studentUser = await usersCol.findOne({ username: cleanUser });
    if (!studentUser) {
      studentUser = await usersCol.findOne({
        username: { $regex: new RegExp(`^${cleanUser}$`, "i") },
      });
    }

    const studentYear = studentUser?.year ? String(studentUser.year).trim() : "";
    const studentBranch = studentUser?.branch ? String(studentUser.branch).trim() : "";
    const studentName = studentUser?.name ? String(studentUser.name).trim() : cleanUser;
    const studentEmail = studentUser?.email ? String(studentUser.email).trim() : "";
    const studentLab = studentUser?.lab ? String(studentUser.lab).trim() : "";

    const testResult = {
      username: cleanUser,
      name: studentName,
      email: studentEmail,
      year: studentYear,
      branch: studentBranch,
      lab: studentLab,
      answers: submittedAnswers,
      timeSpent: verifiedTimeSpent,
      timingStatus,
      violations: violations || 0,
      totalQuestions: finalTotal,
      score: correctAnswers,
      status: "submitted",
      submittedAt: new Date(),
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
      answerBreakdown,
    };

    // Atomic Insertion with Duplicate Key (E11000) Concurrency Handling
    try {
      await results.insertOne(testResult);
    } catch (insertErr) {
      if (insertErr.code === 11000 || (insertErr.message && insertErr.message.includes("E11000"))) {
        // Concurrently inserted by duplicate click/network retry: fetch authoritative record
        const concurrentResult = await results.findOne({ username: cleanUser });
        if (concurrentResult) {
          return res.status(200).json({
            success: true,
            alreadySubmitted: true,
            message: "Test already submitted previously",
            score: concurrentResult.score,
            totalQuestions: concurrentResult.totalQuestions,
          });
        }
      }
      throw insertErr;
    }

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