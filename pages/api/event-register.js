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
    registeredAt: timestamp,
    status: "CONFIRMED",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  };

  let mongoSaved = false;
  let googleSheetDispatched = false;

  // 1. Save to MongoDB Atlas (event_registrations collection)
  try {
    const mongo = await clientPromise;
    if (mongo) {
      const db = mongo.db("test");
      await db.collection("event_registrations").insertOne(regRecord);
      mongoSaved = true;
    }
  } catch (mongoErr) {
    console.warn("MongoDB Atlas registration backup notice:", mongoErr.message);
  }

  // 2. Dispatch to Google Apps Script / Google Drive Sheets Webhook
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;
  if (googleScriptUrl) {
    try {
      const gRes = await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regRecord),
        redirect: "follow",
      });
      googleSheetDispatched = gRes.ok || gRes.status === 302 || gRes.status === 200;
    } catch (sheetErr) {
      console.warn("Google Sheets webhook dispatch notice:", sheetErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Registration successfully recorded!",
    ticketId: regRecord.ticketId,
    mongoSaved,
    googleSheetDispatched,
  });
}
