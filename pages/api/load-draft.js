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

    const responseDraft = {
      ...draft,
      questions: restoredQuestions.length > 0 ? restoredQuestions : draft.questions || [],
    };

    return res.status(200).json({ draft: responseDraft });
  } catch (err) {
    console.error("Load draft error:", err);
    return res.status(500).json({ error: "Failed to load draft" });
  }
}