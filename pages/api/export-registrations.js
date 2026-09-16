import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://roshangaikwad2006_db_user:VZSn3qP6xIR2Pjxv@cluster0.qtasksf.mongodb.net/?retryWrites=true&w=majority";
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect().catch((err) => {
    console.warn("MongoDB connection warning in export-registrations:", err.message);
    return null;
  });
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  try {
    const mongo = await clientPromise;
    if (!mongo) {
      return res.status(500).json({ error: "Database connection unavailable" });
    }

    const db = mongo.db("test");
    const { eventId, format } = req.query;

    const query = eventId ? { eventId } : {};
    const registrations = await db
      .collection("event_registrations")
      .find(query)
      .sort({ registeredAt: -1 })
      .toArray();

    // If JSON requested
    if (format === "json") {
      return res.status(200).json({
        total: registrations.length,
        registrations,
      });
    }

    // Default: CSV format for Excel/Google Sheets
    const headers = [
      "Ticket ID",
      "Event Title",
      "Full Name",
      "Email",
      "Contact Number",
      "Department",
      "Year",
      "Reason/Motivation",
      "Registered At",
      "Status",
    ];

    const csvRows = [headers.join(",")];

    for (const r of registrations) {
      const row = [
        `"${r.ticketId || ""}"`,
        `"${(r.eventTitle || "").replace(/"/g, '""')}"`,
        `"${(r.fullName || "").replace(/"/g, '""')}"`,
        `"${r.email || ""}"`,
        `"'${r.contactNumber || ""}"`, // apostrophe ensures leading 0 isn't stripped in Excel
        `"${(r.department || "").replace(/"/g, '""')}"`,
        `"${r.year || ""}"`,
        `"${(r.reason || "").replace(/"/g, '""')}"`,
        `"${r.registeredAt || ""}"`,
        `"${r.status || "CONFIRMED"}"`,
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CSI_Registrations_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ error: error.message });
  }
}
