import { getTestDb } from "../../src/lib/testDb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, username } = req.query;

  try {
    const db = await getTestDb();

    if (type === "metadata") {
      const testMetadata = db.collection("testmetadata");
      const activeTest = await testMetadata.findOne({ status: "active" });

      if (!activeTest) {
        return res.status(404).json({ error: "No active test found" });
      }

      return res.status(200).json(activeTest);
    }

    // Get question count from testmetadata config
    const testMetadata = db.collection("testmetadata");
    const activeTest = await testMetadata.findOne({ status: "active" });
    const questionCount = activeTest?.config?.totalQuestions || 30;

    const testsCol = db.collection("tests");
    let questionsData = [];

    // Deterministic question assignment:
    // If username is provided, check if questions were already locked in student's draft
    if (username) {
      const cleanUser = String(username).trim();
      const draftsCol = db.collection("draft");
      const existingDraft = await draftsCol.findOne({ username: cleanUser });

      if (existingDraft && Array.isArray(existingDraft.questionIds) && existingDraft.questionIds.length > 0) {
        const objectIds = existingDraft.questionIds
          .filter((id) => ObjectId.isValid(id))
          .map((id) => new ObjectId(id));

        const fetchedDocs = await testsCol.find({ _id: { $in: objectIds } }).toArray();
        const docMap = new Map();
        fetchedDocs.forEach((doc) => docMap.set(doc._id.toString(), doc));

        // Preserve the exact order originally presented to this student
        questionsData = existingDraft.questionIds
          .map((id) => docMap.get(id))
          .filter(Boolean);
      }
    }

    // If no prior question assignment exists, sample fresh questions
    if (!questionsData.length) {
      questionsData = await testsCol
        .aggregate([{ $sample: { size: questionCount } }])
        .toArray();

      // If user is logged in, immediately reserve these question IDs in draft so refreshes don't desync
      if (username && questionsData.length > 0) {
        const cleanUser = String(username).trim();
        const draftsCol = db.collection("draft");
        const assignedIds = questionsData.map((q) => q._id.toString());
        await draftsCol.updateOne(
          { username: cleanUser },
          {
            $setOnInsert: {
              username: cleanUser,
              questionIds: assignedIds,
              answers: {},
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
    }

    // ANTI-CHEATING: NEVER send correctAnswer to frontend!
    const formattedQuestions = questionsData.map((q, index) => ({
      id: index,
      _id: q._id.toString(),
      question: q.question,
      options: q.options,
      image: q.image || undefined,
    }));

    return res.status(200).json({
      questions: formattedQuestions,
      questionIds: questionsData.map((q) => q._id.toString()),
      totalQuestions: formattedQuestions.length,
    });
  } catch (err) {
    console.error("Questions API error:", err);
    return res.status(500).json({ error: "Failed to fetch test questions" });
  }
}