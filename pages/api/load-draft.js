import { getTestDb } from "../../src/lib/testDb";
import { ObjectId } from "mongodb";

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
    const drafts = db.collection("draft");
    const tests = db.collection("tests");

    const draft = await drafts.findOne({ username: cleanUser });

    if (!draft) {
      return res.status(200).json({ draft: null });
    }

    // Verify draft category integrity
    const usersCol = db.collection("aptiuser");
    let student = await usersCol.findOne({ username: cleanUser });
    if (!student) {
      student = await usersCol.findOne({
        username: { $regex: new RegExp(`^${cleanUser}$`, "i") },
      });
    }

    const lowerUser = cleanUser.toLowerCase();
    const isSampleCandidate =
      student?.category === "SAMPLE_TY_FINAL" ||
      student?.isCommittee ||
      lowerUser.startsWith("csi_") ||
      lowerUser.startsWith("dummy_ty_") ||
      lowerUser.startsWith("dummy_final_") ||
      lowerUser.startsWith("test_ty_") ||
      lowerUser === "roshan_ty_admin";

    const expectedCategory = isSampleCandidate ? "SAMPLE_TY_FINAL" : student?.category || "FY_SY";
    const expectedCount = isSampleCandidate ? 25 : 50;

    if (
      draft.category !== expectedCategory ||
      (Array.isArray(draft.questionIds) && draft.questionIds.length !== expectedCount)
    ) {
      await drafts.deleteOne({ username: cleanUser });
      return res.status(200).json({ draft: null });
    }

    // If draft contains questionIds, populate genuine questions without correctAnswer
    let restoredQuestions = [];
    if (Array.isArray(draft.questionIds) && draft.questionIds.length > 0) {
      const objectIds = draft.questionIds
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      const fetchedDocs = await tests.find({ _id: { $in: objectIds } }).toArray();
      const docMap = new Map();
      fetchedDocs.forEach((doc) => docMap.set(doc._id.toString(), doc));

      restoredQuestions = draft.questionIds
        .map((id, index) => {
          const doc = docMap.get(id);
          if (!doc) return null;
          return {
            id: index,
            _id: doc._id.toString(),
            question: doc.question,
            options: doc.options,
            image: doc.image || undefined,
          };
        })
        .filter(Boolean);
    }

    // Fetch active test metadata for duration
    const metaCol = db.collection("testmetadata");
    const activeTest = await metaCol.findOne({ status: "active" });
    const duration = activeTest?.schedule?.duration || activeTest?.config?.duration || 3600;

    const serverNow = new Date();
    let deadline = null;
    let serverRemainingSeconds = duration;

    if (draft.startTime || draft.createdAt) {
      const startTime = new Date(draft.startTime || draft.createdAt);
      deadline = new Date(startTime.getTime() + duration * 1000).toISOString();
      serverRemainingSeconds = Math.max(0, Math.floor((new Date(deadline).getTime() - serverNow.getTime()) / 1000));
    }

    const responseDraft = {
      ...draft,
      revision: typeof draft.revision === "number" ? draft.revision : 1,
      serverTime: serverNow.toISOString(),
      deadline,
      serverRemainingSeconds,
      questions: restoredQuestions.length > 0 ? restoredQuestions : draft.questions || [],
    };

    return res.status(200).json({ draft: responseDraft });
  } catch (err) {
    console.error("Load draft error:", err);
    return res.status(500).json({ error: "Failed to load draft" });
  }
}