import { getTestDb } from "../../src/lib/testDb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { format, secret } = req.query;

  try {
    const db = await getTestDb();
    const resultsCol = db.collection("testresults");
    const usersCol = db.collection("aptiuser");

    const allResults = await resultsCol
      .find({})
      .sort({ score: -1, timeSpent: 1 })
      .toArray();

    const usernames = allResults.map((r) => r.username);
    const users = await usersCol.find({ username: { $in: usernames } }).toArray();
    const userMap = new Map();
    users.forEach((u) => userMap.set(u.username, u));

    const enrichedResults = allResults.map((item, index) => {
      const user = userMap.get(item.username) || {};
      const score = item.score || 0;
      const total = item.totalQuestions || 50;
      const percentage = ((score / total) * 100).toFixed(1);
      const timeMins = (item.timeSpent ? item.timeSpent / 60 : 0).toFixed(1);

      return {
        rank: index + 1,
        username: item.username,
        name: user.name || item.username,
        year: user.year || "FY/SY",
        branch: user.branch || "",
        lab: user.lab || "",
        score,
        totalQuestions: total,
        percentage: Number(percentage),
        timeSpentMins: Number(timeMins),
        violations: item.violations || 0,
        submittedAt: item.submittedAt || null,
      };
    });

    if (format === "csv") {
      const headers = [
        "Rank",
        "Username",
        "Name",
        "Year",
        "Branch",
        "Lab",
        "Score",
        "Total",
        "Percentage",
        "Time Mins",
        "Violations",
        "Submitted At",
      ];

      const csvRows = [headers.join(",")];
      enrichedResults.forEach((r) => {
        csvRows.push(
          [
            r.rank,
            `"${r.username}"`,
            `"${r.name}"`,
            `"${r.year}"`,
            `"${r.branch}"`,
            `"${r.lab}"`,
            r.score,
            r.totalQuestions,
            `"${r.percentage}%"`,
            r.timeSpentMins,
            r.violations,
            `"${r.submittedAt ? new Date(r.submittedAt).toISOString() : ""}"`,
          ].join(",")
        );
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="CSI_Aptitude_Results_2026.csv"');
      return res.status(200).send(csvRows.join("\n"));
    }

    const totalSubmissions = enrichedResults.length;
    const avgScore =
      totalSubmissions > 0
        ? (enrichedResults.reduce((acc, r) => acc + r.score, 0) / totalSubmissions).toFixed(1)
        : 0;
    const highestScore = totalSubmissions > 0 ? enrichedResults[0].score : 0;

    return res.status(200).json({
      success: true,
      totalSubmissions,
      highestScore,
      averageScore: Number(avgScore),
      results: enrichedResults,
    });
  } catch (err) {
    console.error("Test results API error:", err);
    return res.status(500).json({ error: "Failed to fetch test results" });
  }
}
