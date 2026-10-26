import { getTestDb } from "../../src/lib/testDb";
import { ObjectId } from "mongodb";

// High-performance in-memory promise caches to eliminate redundant MongoDB Atlas roundtrips
let cachedMetadataPromise = null;
let metadataCachedAt = 0;
const categoryPoolPromiseCache = new Map();
let categoryPoolCachedAt = 0;

function getCategoryPool(testsCol, category) {
  const now = Date.now();
  if (categoryPoolPromiseCache.has(category) && now - categoryPoolCachedAt < 60000) {
    return categoryPoolPromiseCache.get(category);
  }
  const promise = testsCol.find({ category }).toArray().catch((err) => {
    categoryPoolPromiseCache.delete(category);
    throw err;
  });
  categoryPoolPromiseCache.set(category, promise);
  categoryPoolCachedAt = now;
  return promise;
}

function getActiveMetadata(testMetadataCol) {
  const now = Date.now();
  if (cachedMetadataPromise && now - metadataCachedAt < 30000) {
    return cachedMetadataPromise;
  }
  cachedMetadataPromise = testMetadataCol.findOne({ status: "active" }).catch((err) => {
    cachedMetadataPromise = null;
    throw err;
  });
  metadataCachedAt = now;
  return cachedMetadataPromise;
}

function sampleQuestionsLocally(pool, count) {
  const cloned = [...pool];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned.slice(0, count);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, username, category } = req.query;

  try {
    const db = await getTestDb();
    const testMetadata = db.collection("testmetadata");

    // Fast cached metadata (promise-shared across concurrent hits)
    const activeTest = await getActiveMetadata(testMetadata);

    if (type === "metadata") {
      if (!activeTest) {
        return res.status(404).json({ error: "No active test found" });
      }
      return res.status(200).json(activeTest);
    }

    // Get question count from testmetadata config
    const questionCount = activeTest?.config?.totalQuestions || 50;

    const testsCol = db.collection("tests");
    let questionsData = [];

    // 1. Resolve Target Category FIRST before inspecting drafts
    let targetCategory = category || "FY_SY";
    if (username) {
      const cleanUser = String(username).trim();
      const lowerUser = cleanUser.toLowerCase();
      const usersCol = db.collection("aptiuser");
      let student = await usersCol.findOne({ username: cleanUser });
      if (!student) {
        student = await usersCol.findOne({
          username: { $regex: new RegExp(`^${cleanUser}$`, "i") },
        });
      }

      if (
        student?.category === "SAMPLE_TY_FINAL" ||
        student?.isCommittee ||
        lowerUser.startsWith("csi_") ||
        lowerUser.startsWith("dummy_ty_") ||
        lowerUser.startsWith("dummy_final_") ||
        lowerUser.startsWith("test_ty_") ||
        lowerUser === "roshan_ty_admin"
      ) {
        targetCategory = "SAMPLE_TY_FINAL";
      } else if (student && student.category) {
        targetCategory = student.category;
      } else if (student && student.year) {
        const yr = String(student.year).trim().toUpperCase();
        const isTyOrFinal =
          yr.includes("TY") ||
          yr.includes("THIRD") ||
          yr.includes("TE") ||
          yr.includes("FINAL") ||
          yr.includes("FOURTH") ||
          yr.includes("BE") ||
          yr.includes("BTECH") ||
          yr.includes("4");

        targetCategory = isTyOrFinal ? "TY_FINAL" : "FY_SY";
      }
    }

    const effectiveQuestionCount = targetCategory === "SAMPLE_TY_FINAL" ? 25 : questionCount;

    // 2. Deterministic question assignment:
    // Check if questions were already locked in student's draft matching the exact category & count
    if (username) {
      const cleanUser = String(username).trim();
      const draftsCol = db.collection("draft");
      const existingDraft = await draftsCol.findOne({ username: cleanUser });

      if (
        existingDraft &&
        Array.isArray(existingDraft.questionIds) &&
        existingDraft.questionIds.length === effectiveQuestionCount &&
        existingDraft.category === targetCategory
      ) {
        const objectIds = existingDraft.questionIds
          .filter((id) => ObjectId.isValid(id))
          .map((id) => new ObjectId(id));

        const fetchedDocs = await testsCol
          .find({ _id: { $in: objectIds }, category: targetCategory })
          .toArray();

        if (fetchedDocs.length === effectiveQuestionCount) {
          const docMap = new Map();
          fetchedDocs.forEach((doc) => docMap.set(doc._id.toString(), doc));

          // Preserve the exact order originally presented to this student
          questionsData = existingDraft.questionIds
            .map((id) => docMap.get(id))
            .filter(Boolean);
        }
      }

      // If existingDraft had mismatched category, wrong count, or stale confidential questions, purge it
      if (existingDraft && questionsData.length !== effectiveQuestionCount) {
        await draftsCol.deleteOne({ username: cleanUser });
      }
    }

    // 3. If no prior valid question assignment exists, sample fresh questions by Category
    if (!questionsData.length) {
      // High-performance question pool sampling (eliminates MongoDB Atlas $sample collection locks)
      const pool = await getCategoryPool(testsCol, targetCategory);
      if (pool && pool.length >= effectiveQuestionCount) {
        questionsData = sampleQuestionsLocally(pool, effectiveQuestionCount);
      } else {
        // Fallback to direct query if pool is smaller
        questionsData = await testsCol.find({ category: targetCategory }).limit(effectiveQuestionCount).toArray();
      }

      // If user is logged in, immediately reserve these question IDs in draft so refreshes don't desync
      if (username && questionsData.length > 0) {
        const cleanUser = String(username).trim();
        const draftsCol = db.collection("draft");
        const assignedIds = questionsData.map((q) => q._id.toString());
        const upsertResult = await draftsCol.updateOne(
          { username: cleanUser },
          {
            $set: {
              username: cleanUser,
              questionIds: assignedIds,
              category: targetCategory,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              answers: {},
              revision: 1,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );

        // Atomic Race Recovery: Only check authoritative draft if another concurrent request won the upsert
        if (upsertResult.upsertedCount === 0) {
          const authoritativeDraft = await draftsCol.findOne({ username: cleanUser });
          if (
            authoritativeDraft &&
            Array.isArray(authoritativeDraft.questionIds) &&
            authoritativeDraft.questionIds.length === effectiveQuestionCount &&
            authoritativeDraft.category === targetCategory
          ) {
            const isIdentical =
              authoritativeDraft.questionIds.length === questionsData.length &&
              authoritativeDraft.questionIds.every((id, idx) => questionsData[idx] && questionsData[idx]._id.toString() === id);

            if (!isIdentical) {
              const objectIds = authoritativeDraft.questionIds
                .filter((id) => ObjectId.isValid(id))
                .map((id) => new ObjectId(id));
              const fetchedDocs = await testsCol
                .find({ _id: { $in: objectIds }, category: targetCategory })
                .toArray();
              if (fetchedDocs.length === effectiveQuestionCount) {
                const docMap = new Map();
                fetchedDocs.forEach((doc) => docMap.set(doc._id.toString(), doc));
                questionsData = authoritativeDraft.questionIds
                  .map((id) => docMap.get(id))
                  .filter(Boolean);
              }
            }
          }
        }
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