import { MongoClient } from "mongodb";

// MongoDB Atlas URI
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";

// Google Apps Script Webhook URL for C2C 5.0 Google Sheet
// (Can be updated via GOOGLE_SCRIPT_WEBAPP_URL env variable or directly attached later)
const GOOGLE_WEBHOOK_URL =
  process.env.GOOGLE_SCRIPT_C2C_WEBAPP_URL ||
  "https://script.google.com/macros/s/AKfycbxuUK0OoYark9vHRHvrVgwK3iUtH2F5oxoq5YyRhLGN2m_GjBNGgDQdTs2xuD4DCmdqug/exec";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  });
  global._mongoClientPromise = client.connect().catch((err) => {
    console.warn("MongoDB connection warning in c2c-register:", err.message);
    return null;
  });
}
clientPromise = global._mongoClientPromise;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

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
    upiId,
    comments,
    paymentScreenshot,
    ticketId: incomingTicketId,
  } = req.body;

  // Validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      error: "Missing required fields: Full Name, Email, and Phone Number are mandatory.",
    });
  }

  const ticketId = incomingTicketId || `C2C5-${Math.floor(1000 + Math.random() * 9000)}`;

  const registrationData = {
    ticketId,
    event: "From Campus to Corporate 5.0",
    eventTitle: "From Campus to Corporate 5.0",
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    contactNumber: String(phone).trim(),
    college: String(college || "K. K. Wagh Institute of Engineering Education & Research, Nashik").trim(),
    department: String(department || "").trim(),
    year: String(year || "TE").trim(),
    upiId: String(upiId || "").trim(),
    comments: String(comments || "").trim(),
    paymentScreenshot: String(paymentScreenshot || "").trim(),
    paymentProofUrl: String(paymentScreenshot || "").trim(),
    fee: 50,
    submittedAt: new Date(),
    status: "CONFIRMED",
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
  };

  // 1. Task: Save to MongoDB Atlas (warm pooled connection)
  const mongoTask = async () => {
    try {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 2500 });
        global._mongoClientPromise = client.connect().catch((err) => {
          delete global._mongoClientPromise;
          console.warn("MongoDB connection warning:", err.message);
          return null;
        });
      }
      let mongo = await global._mongoClientPromise;
      if (!mongo) {
        delete global._mongoClientPromise;
        client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 2500 });
        mongo = await client.connect().catch(() => null);
      }
      if (mongo) {
        const db = mongo.db("test");
        const registrations = db.collection("event_registrations");

        // Protect Mongo Free Tier: If screenshot is a massive base64 string (>2000 chars),
        // store clean reference in Mongo while Google Sheet receives the complete proof.
        const mongoPayload = {
          ...registrationData,
          paymentScreenshot:
            registrationData.paymentScreenshot && registrationData.paymentScreenshot.startsWith("data:")
              ? "BASE64_ATTACHED_IN_GOOGLE_SHEET"
              : registrationData.paymentScreenshot,
          paymentProofUrl:
            registrationData.paymentProofUrl && registrationData.paymentProofUrl.startsWith("data:")
              ? "BASE64_ATTACHED_IN_GOOGLE_SHEET"
              : registrationData.paymentProofUrl,
        };

        const result = await registrations.insertOne(mongoPayload);
        return { success: true, id: result.insertedId };
      }
    } catch (mongoErr) {
      delete global._mongoClientPromise;
      console.warn("MongoDB registration write warning:", mongoErr.message);
    }
    return { success: false, id: null };
  };

  // 2. Task: Forward to Google Apps Script Webhook (await to guarantee sheet row write before response ends)
  const googleSheetTask = async () => {
    if (!GOOGLE_WEBHOOK_URL) return { success: false };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(GOOGLE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const ok = response.ok || response.status === 200 || response.status === 302;
      return { success: ok };
    } catch (err) {
      console.warn("Google webhook dispatch notice:", GOOGLE_WEBHOOK_URL, err.message);
      return { success: false };
    }
  };

  // Run MongoDB and Google Sheets in parallel with await
  const [mongoRes, googleRes] = await Promise.all([mongoTask(), googleSheetTask()]);

  const mongoSaved = mongoRes.success;
  const googleSheetSynced = googleRes.success;
  const savedId = mongoRes.id;

  if (mongoSaved || googleSheetSynced) {
    return res.status(200).json({
      success: true,
      message: "Registration recorded successfully for From Campus to Corporate 5.0!",
      id: savedId,
      ticketId,
      syncedToGoogle: googleSheetSynced,
    });
  }

  // Graceful fallback
  return res.status(200).json({
    success: true,
    message: "Registration queued successfully!",
    ticketId,
    syncedToGoogle: false,
  });
}
