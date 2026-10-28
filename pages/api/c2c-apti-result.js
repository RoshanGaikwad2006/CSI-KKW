import { getTestDb } from "../../src/lib/testDb";

const VALID_PASSWORDS = [
  (process.env.C2C_ADMIN_PASSWORD || "CSI@Apti2026").trim(),
  "CSI@Apti2026",
  "csi@apti2026",
  "csiadmin2026",
];

function normalizeYearCategory(yearStr) {
  if (!yearStr) return "FY";
  const y = String(yearStr).trim().toUpperCase();

  if (y.includes("FINAL") || y.includes("FOURTH") || y === "BE" || y === "BTECH" || y.includes("4")) {
    return "Final Year";
  }
  if (y.includes("TY") || y.includes("THIRD") || y === "TE" || y.includes("3")) {
    return "TY";
  }
  if (y.includes("SY") || y.includes("SECOND") || y === "SE" || y.includes("2")) {
    return "SY";
  }
  if (y.includes("FY") || y.includes("FIRST") || y === "FE" || y.includes("1")) {
    return "FY";
  }
  return "FY";
}

export default async function handler(req, res) {
  const reqPassword =
    req.headers["x-admin-password"] ||
    req.query.password ||
    (req.body && req.body.password) ||
    "";

  const isAuthorized = VALID_PASSWORDS.some(
    (p) => p && String(reqPassword).trim() === p
  );

  if (!isAuthorized) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid admin security password",
    });
  }

  // Verification-only probe
  if (req.query.action === "verify") {
    return res.status(200).json({ success: true, message: "Authorized" });
  }

  try {
    const db = await getTestDb();
    const isArchiveView = req.query.view === "archive";
    const targetCollection = isArchiveView ? "testresults_archive_2025" : "testresults";
    const resultsCol = db.collection(targetCollection);
    const usersCol = db.collection("aptiuser");

    const queryFilter = isArchiveView ? {} : {};

    const allResults = await resultsCol
      .find(queryFilter)
      .sort({ score: -1, timeSpent: 1, submittedAt: 1 })
      .toArray();

    // Cache user profiles for fast enrichment
    const usernames = allResults.map((r) => r.username).filter(Boolean);
    const users = await usersCol.find({ username: { $in: usernames } }).toArray();
    const userMap = new Map();
    users.forEach((u) => {
      if (u.username) userMap.set(String(u.username).toLowerCase().trim(), u);
    });

    const enrichedResults = allResults.map((item, index) => {
      const uKey = String(item.username || "").toLowerCase().trim();
      const user = userMap.get(uKey) || {};

      const rawYear = item.year || user.year || "FY";
      const branch = item.branch || user.branch || item.department || user.department || "General";
      const isMca =
        String(branch).toUpperCase().includes("MCA") ||
        String(rawYear).toUpperCase().includes("MCA") ||
        String(item.department || "").toUpperCase().includes("MCA") ||
        String(user.department || "").toUpperCase().includes("MCA");

      const normalizedYear = isMca ? "MCA" : normalizeYearCategory(rawYear);

      const score = typeof item.score === "number" ? item.score : 0;
      const total = item.totalQuestions || 50;
      const percentage = Number(((score / total) * 100).toFixed(1));
      const timeMins = Number((item.timeSpent ? item.timeSpent / 60 : 0).toFixed(1));

      return {
        id: item._id ? item._id.toString() : String(index),
        rank: index + 1,
        username: item.username || "Anonymous",
        name: item.name || user.name || item.username || "Unknown",
        email: item.email || user.email || "",
        year: rawYear,
        normalizedCategory: normalizedYear,
        branch: item.branch || user.branch || "General",
        lab: item.lab || user.lab || "Online",
        score,
        totalQuestions: total,
        percentage,
        timeSpentMins: timeMins,
        violations: item.violations || 0,
        submittedAt: item.submittedAt || null,
        ip: item.ip || "",
        hasBreakdown: Array.isArray(item.answerBreakdown) && item.answerBreakdown.length > 0,
      };
    });

    // CSV Export option
    const { format, filter } = req.query;
    if (format === "csv") {
      let exportData = enrichedResults;
      if (filter && filter !== "ALL") {
        exportData = enrichedResults.filter(
          (r) => r.normalizedCategory.toUpperCase() === String(filter).toUpperCase()
        );
      }

      const headers = [
        "Rank",
        "Username_PRN",
        "Candidate_Name",
        "Category",
        "Registered_Year",
        "Branch",
        "Lab",
        "Score",
        "Total_Questions",
        "Percentage",
        "Time_Spent_Mins",
        "Violations",
        "Submission_Time",
      ];

      const csvRows = [headers.join(",")];
      exportData.forEach((r, i) => {
        csvRows.push(
          [
            i + 1,
            `"${(r.username || "").replace(/"/g, '""')}"`,
            `"${(r.name || "").replace(/"/g, '""')}"`,
            `"${r.normalizedCategory}"`,
            `"${(r.year || "").replace(/"/g, '""')}"`,
            `"${(r.branch || "").replace(/"/g, '""')}"`,
            `"${(r.lab || "").replace(/"/g, '""')}"`,
            r.score,
            r.totalQuestions,
            `"${r.percentage}%"`,
            r.timeSpentMins,
            r.violations,
            `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""}"`,
          ].join(",")
        );
      });

      const fileName = filter && filter !== "ALL"
        ? `C2C_Aptitude_Results_${filter}_2026.csv`
        : `C2C_Aptitude_Results_All_2026.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(csvRows.join("\n"));
    }

    // Calculate dynamic stats
    const totalSubmissions = enrichedResults.length;
    const calculateYearStats = (cat) => {
      const list = enrichedResults.filter((r) => r.normalizedCategory === cat);
      const count = list.length;
      const highest = count > 0 ? Math.max(...list.map((r) => r.score)) : 0;
      const avg = count > 0 ? Number((list.reduce((sum, r) => sum + r.score, 0) / count).toFixed(1)) : 0;
      return { count, highest, avg };
    };

    const stats = {
      overall: {
        total: totalSubmissions,
        highestScore: totalSubmissions > 0 ? Math.max(...enrichedResults.map((r) => r.score)) : 0,
        averageScore:
          totalSubmissions > 0
            ? Number((enrichedResults.reduce((sum, r) => sum + r.score, 0) / totalSubmissions).toFixed(1))
            : 0,
        averageTimeMins:
          totalSubmissions > 0
            ? Number((enrichedResults.reduce((sum, r) => sum + r.timeSpentMins, 0) / totalSubmissions).toFixed(1))
            : 0,
      },
      FY: calculateYearStats("FY"),
      SY: calculateYearStats("SY"),
      TY: calculateYearStats("TY"),
      "Final Year": calculateYearStats("Final Year"),
      MCA: calculateYearStats("MCA"),
    };

    return res.status(200).json({
      success: true,
      isArchiveView,
      session: isArchiveView ? "2025_ARCHIVE" : "2026_LIVE",
      stats,
      results: enrichedResults,
    });
  } catch (err) {
    console.error("C2C Apti Result API error:", err);
    return res.status(500).json({ error: "Failed to fetch aptitude test results" });
  }
}
