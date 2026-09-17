import { MongoClient } from "mongodb";

// MongoDB Atlas URI (uses environment variable with existing cluster fallback)
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";

const GOOGLE_SCRIPT_WEBAPP_URL =
  process.env.GOOGLE_SCRIPT_WEBAPP_URL ||
  "https://script.google.com/macros/s/AKfycbzrwqtTr-dSofOpK9jujNT7yK5utJXxfXQ6vhKweDQnV1DoHwQpA-pM3v9tosMlQv68/exec";

// Global cached connection promise for Next.js serverless pooling
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  });
  global._mongoClientPromise = client.connect().catch((err) => {
    console.warn("MongoDB connection warning in vision-week-register:", err.message);
    return null;
  });
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const {
    fullName,
    email,
    phone,
    college,
    department,
    year,
    prn,
    track,
    comments,
    paymentScreenshot,
  } = req.body;

  // Validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      error: "Missing required fields: fullName, email, and phone are mandatory.",
    });
  }

  const registrationData = {
    event: "Vision Week 2026",
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    college: String(college || "KKWIEER").trim(),
    department: String(department || "Computer Engineering").trim(),
    year: String(year || "TE").trim(),
    prn: String(prn || "").trim(),
    track: String(track || "General").trim(),
    comments: String(comments || "").trim(),
    paymentScreenshot: String(paymentScreenshot || "").trim(),
    submittedAt: new Date(),
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
  };

  // 1. Task: Save to MongoDB Atlas (warm pooled connection < 50ms)
  const mongoTask = async () => {
    try {
      const mongo = await clientPromise;
      if (mongo) {
        const db = mongo.db("test");
        const registrations = db.collection("event_registrations");
        const result = await registrations.insertOne(registrationData);
        return { success: true, id: result.insertedId };
      }
    } catch (mongoErr) {
      console.warn("MongoDB registration write warning:", mongoErr.message);
    }
    return { success: false, id: null };
  };

  // 2. Task: Forward to Google Apps Script Webhook with 3.5s timeout (in parallel)
  const googleSheetTask = async () => {
    if (!GOOGLE_SCRIPT_WEBAPP_URL) return { success: false };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // Prevents Google script from hanging
      const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return { success: response.ok || response.status === 200 || response.status === 302 };
    } catch (googleErr) {
      console.warn("Google Sheets webhook notice (non-fatal):", googleErr.message);
      return { success: false };
    }
  };

  // Run MongoDB and Google Sheets simultaneously in parallel!
  const [mongoRes, googleRes] = await Promise.all([mongoTask(), googleSheetTask()]);

  const mongoSaved = mongoRes.success;
  const googleSheetSynced = googleRes.success;
  const savedId = mongoRes.id;

  // If at least MongoDB saved or Google accepted, return immediate success
  if (mongoSaved || googleSheetSynced) {
    return res.status(200).json({
      success: true,
      message: "Registration recorded successfully for Vision Week 2026!",
      id: savedId,
      syncedToGoogle: googleSheetSynced,
    });
  }

  // Fallback response
  return res.status(200).json({
    success: true,
    message: "Registration accepted.",
  });
}
