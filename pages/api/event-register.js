import { MongoClient } from "mongodb";

// MongoDB Atlas URI
const uri = process.env.MONGODB_URI || "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().catch((err) => {
    console.warn("MongoDB connection warning in event-register:", err.message);
    return null;
  });
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }

  const {
    fullName,
    email,
    contactNumber,
    department,
    year,
    reason,
    eventId,
    eventTitle,
    ticketId,
    upiId,
  } = req.body;

  // Validation
  if (!fullName || !email || !contactNumber || !department || !year) {
    return res.status(400).json({
      success: false,
      message: "Missing required registration fields (Full Name, Email, Contact Number, Department, Year)",
    });
  }

  const timestamp = new Date().toISOString();
  const regRecord = {
    ticketId: ticketId || `CSI-EVT-${Date.now().toString().slice(-4)}`,
    fullName,
    email,
    contactNumber,
    department,
    year,
    reason: reason || "",
    eventId: eventId || "general-event",
    eventTitle: eventTitle || "CSI KKWIEER Event",
    upiId: upiId || "",
    registeredAt: timestamp,
    status: "CONFIRMED",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  };

  // 1. Task: Save to MongoDB Atlas (warm pooled connection < 50ms)
  const mongoTask = async () => {
    try {
      const mongo = await clientPromise;
      if (mongo) {
        const db = mongo.db("test");
        await db.collection("event_registrations").insertOne(regRecord);
        return true;
      }
    } catch (mongoErr) {
      console.warn("MongoDB Atlas registration backup notice:", mongoErr.message);
    }
    return false;
  };

  // 2. Task: Dispatch to Google Apps Script Webhooks with 3.5s timeout (in parallel)
  const eventWebhooks = [
    process.env.GOOGLE_SCRIPT_WEBAPP_URL,
    "https://script.google.com/macros/s/AKfycbxM9ZEgALXG9q8lIVO-dkuxNdXGisQgufpdvt-z8Gak0h1Y34w9MylquFt9CPEY_lNH/exec",
    "https://script.google.com/macros/s/AKfycbzrwqtTr-dSofOpK9jujNT7yK5utJXxfXQ6vhKweDQnV1DoHwQpA-pM3v9tosMlQv68/exec",
  ].filter(Boolean);
  const uniqueEventWebhooks = [...new Set(eventWebhooks)];

  const googleSheetTask = async () => {
    if (uniqueEventWebhooks.length === 0) return false;
    const dispatches = uniqueEventWebhooks.map(async (webhookUrl) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const gRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regRecord),
          redirect: "follow",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return gRes.ok || gRes.status === 302 || gRes.status === 200;
      } catch (sheetErr) {
        console.warn("Google Sheets webhook notice:", webhookUrl, sheetErr.message);
        return false;
      }
    });
    const results = await Promise.all(dispatches);
    return results.some(Boolean);
  };

  // Execute simultaneously!
  const [mongoSaved, googleSheetDispatched] = await Promise.all([
    mongoTask(),
    googleSheetTask(),
  ]);

  return res.status(200).json({
    success: true,
    message: "Registration successfully recorded!",
    ticketId: regRecord.ticketId,
    mongoSaved,
    googleSheetDispatched,
  });
}
