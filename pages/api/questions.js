import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type } = req.query;

  try {
    await client.connect();
    const db = client.db("test");
    
    if (type === 'metadata') {
      const testMetadata = db.collection("testmetadata");
      const activeTest = await testMetadata.findOne({ status: "active" });
      
      if (!activeTest) {
        return res.status(404).json({ error: "No active test found" });
      }
      
      res.json(activeTest);
    } else {
      // Get question count from testmetadata config
      const testMetadata = db.collection("testmetadata");
      const activeTest = await testMetadata.findOne({ status: "active" });
      const questionCount = activeTest?.config?.totalQuestions || 15;
      
      const questions = db.collection("tests");
      const questionsData = await questions.aggregate([
        { $sample: { size: questionCount } }
      ]).toArray();
      
      const formattedQuestions = questionsData.map((q, index) => ({
        id: index,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        image: q.image || undefined
      }));
      
      res.json({ questions: formattedQuestions });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await client.close();
  }
}