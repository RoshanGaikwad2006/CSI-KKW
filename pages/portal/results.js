import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ResultsPage() {
  const [data, setData] = useState({ results: [], totalSubmissions: 0, highestScore: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('ALL');

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/test-results');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = (data.results || []).filter((r) => {
    const matchesSearch =
      r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === 'ALL' || r.year === filterYear;
    return matchesSearch && matchesYear;
  });

  return (
    <>
      <Head>
        <title>CSI Aptitude Assessment Leaderboard 2026</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                CSI Technical Aptitude Leaderboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Official test results and candidate performance rankings
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={fetchResults}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                🔄 Refresh Live
              </button>
              <a
                href="/api/test-results?format=csv"
                download="CSI_Aptitude_Results_2026.csv"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
              >
                📥 Export CSV / Excel
              </a>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Submissions</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{data.totalSubmissions}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase">Highest Score</span>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {data.highestScore} <span className="text-sm font-normal text-gray-500">marks</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase">Average Score</span>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {data.averageScore} <span className="text-sm font-normal text-gray-500">marks</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase">Top Candidate</span>
              <p className="text-lg font-bold text-gray-900 mt-2 truncate">
                {data.results[0]?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search by student name, PRN, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {['ALL', 'FY', 'SY'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setFilterYear(yr)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    filterYear === yr
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {yr === 'ALL' ? 'All Candidates' : `${yr} Only`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm">Loading test results from database...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                No matching results found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 text-left">Rank</th>
                      <th className="px-5 py-3.5 text-left">Candidate Name</th>
                      <th className="px-5 py-3.5 text-left">Username / PRN</th>
                      <th className="px-5 py-3.5 text-left">Year / Branch</th>
                      <th className="px-5 py-3.5 text-center">Score</th>
                      <th className="px-5 py-3.5 text-center">Percentage</th>
                      <th className="px-5 py-3.5 text-center">Time Taken</th>
                      <th className="px-5 py-3.5 text-center">Violations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {filteredResults.map((r) => {
                      const isTop3 = r.rank <= 3;
                      return (
                        <tr key={r.username} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 whitespace-nowrap font-bold">
                            {r.rank === 1 ? '🥇 1' : r.rank === 2 ? '🥈 2' : r.rank === 3 ? '🥉 3' : `#${r.rank}`}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">{r.name}</span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                            {r.username}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                            {r.year} {r.branch ? `• ${r.branch}` : ''}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center font-bold text-base text-gray-900">
                            {r.score} <span className="text-xs font-normal text-gray-500">/{r.totalQuestions}</span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                r.percentage >= 75
                                  ? 'bg-green-100 text-green-800'
                                  : r.percentage >= 50
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {r.percentage}%
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center text-xs text-gray-600">
                            {r.timeSpentMins} mins
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            {r.violations > 0 ? (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                                {r.violations}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">0</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
