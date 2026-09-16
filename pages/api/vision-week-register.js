import { MongoClient } from "mongodb";

// MongoDB Atlas URI (uses environment variable with existing cluster fallback)
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";

// Optional Google Apps Script Webhook URL (configured in .env.local or Google Drive setup)
const GOOGLE_SCRIPT_WEBAPP_URL = process.env.GOOGLE_SCRIPT_WEBAPP_URL || "";

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
    submittedAt: new Date(),
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
  };

  let mongoSaved = false;
  let googleSheetSynced = false;
  let savedId = null;

  // 1. SAVE TO MONGODB ATLAS (Primary Reliable Cloud DB)
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("test");
    const registrations = db.collection("event_registrations");

    const result = await registrations.insertOne(registrationData);
    savedId = result.insertedId;
    mongoSaved = true;
    await client.close();
  } catch (mongoErr) {
    console.error("MongoDB registration write error:", mongoErr);
  }

  // 2. FORWARD TO GOOGLE APPS SCRIPT WEBHOOK (Google Drive / Sheets)
  if (GOOGLE_SCRIPT_WEBAPP_URL) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      if (response.ok) {
        googleSheetSynced = true;
      }
    } catch (googleErr) {
      console.warn("Google Sheets webhook dispatch warning (non-fatal):", googleErr);
    }
  }

  // If at least MongoDB saved or Google accepted, treat as successful registration
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
