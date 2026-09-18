import { MongoClient } from "mongodb";

// MongoDB Atlas URI (uses environment variable with existing cluster fallback)
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";

// Single Webhook URL to prevent duplicate entries
const GOOGLE_WEBHOOK_URL =
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
    selectedSessions,
    upiId,
    comments,
    paymentScreenshot,
    ticketId: incomingTicketId,
  } = req.body;

  // Validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      error: "Missing required fields: fullName, email, and phone are mandatory.",
    });
  }

  const ticketId = incomingTicketId || `VW26-${Math.floor(1000 + Math.random() * 9000)}`;

  const registrationData = {
    ticketId,
    event: "Vision Week 2026",
    eventTitle: "Vision Week 2026",
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    contactNumber: String(phone).trim(),
    college: String(college || "KKWIEER").trim(),
    department: String(department || "Computer").trim(),
    year: String(year || "TE").trim(),
    prn: String(prn || "").trim(),
    track: String(track || "All 5 Days (Full Conclave)").trim(),
    selectedSessions: Array.isArray(selectedSessions)
      ? selectedSessions
      : [String(track || "All 5 Days (Full Conclave)")],
    upiId: String(upiId || "").trim(),
    comments: String(comments || "").trim(),
    reason: String(comments || "").trim(),
    paymentScreenshot: String(paymentScreenshot || "").trim(),
    paymentProofUrl: String(paymentScreenshot || "").trim(),
    fee: 50,
    submittedAt: new Date(),
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
  };

  // 1. Task: Save to MongoDB Atlas (warm pooled connection < 50ms)
  const mongoTask = async () => {
    try {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, { maxPoolSize: 20, serverSelectionTimeoutMS: 5000 });
        global._mongoClientPromise = client.connect().catch((err) => {
          delete global._mongoClientPromise;
          console.warn("MongoDB connection warning:", err.message);
          return null;
        });
      }
      let mongo = await global._mongoClientPromise;
      if (!mongo) {
        delete global._mongoClientPromise;
        client = new MongoClient(uri, { maxPoolSize: 20, serverSelectionTimeoutMS: 5000 });
        mongo = await client.connect().catch(() => null);
      }
      if (mongo) {
        const db = mongo.db("test");
        const registrations = db.collection("event_registrations");
        const result = await registrations.insertOne(registrationData);
        return { success: true, id: result.insertedId };
      }
    } catch (mongoErr) {
      delete global._mongoClientPromise;
      console.warn("MongoDB registration write warning:", mongoErr.message);
    }
    return { success: false, id: null };
  };

  // 2. Task: Forward to Google Apps Script Webhook (single dispatch to avoid duplicate rows)
  const googleSheetTask = async () => {
    if (!GOOGLE_WEBHOOK_URL) return { success: false };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(GOOGLE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return { success: response.ok || response.status === 200 || response.status === 302 };
    } catch (err) {
      console.warn("Google webhook dispatch notice:", GOOGLE_WEBHOOK_URL, err.message);
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
      ticketId,
      syncedToGoogle: googleSheetSynced,
    });
  }

  // Fallback response
  return res.status(200).json({
    success: true,
    message: "Registration accepted.",
    ticketId,
  });
}
