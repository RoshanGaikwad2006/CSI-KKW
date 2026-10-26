import React, { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Search,
  Download,
  RefreshCw,
  Award,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";

interface CandidateResult {
  id: string;
  rank: number;
  username: string;
  name: string;
  email: string;
  year: string;
  normalizedCategory: "FY" | "SY" | "TY" | "Final Year" | string;
  branch: string;
  lab: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentMins: number;
  violations: number;
  submittedAt: string | null;
  ip: string;
  hasBreakdown: boolean;
}

interface YearStat {
  count: number;
  highest: number;
  avg: number;
}

interface DashboardStats {
  overall: {
    total: number;
    highestScore: number;
    averageScore: number;
    averageTimeMins: number;
  };
  FY: YearStat;
  SY: YearStat;
  TY: YearStat;
  "Final Year": YearStat;
}

const STORAGE_AUTH_KEY = "csi_c2c_admin_token";

export default function C2CAptiResultPage() {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [viewMode, setViewMode] = useState<"live" | "archive">("live");
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "FY" | "SY" | "TY" | "Final Year">("ALL");
  const [sortBy, setSortBy] = useState<"rank" | "time" | "violations" | "recent">("rank");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);

  // Authenticate Admin
  const handleLogin = async (e?: React.FormEvent, passToTest?: string) => {
    if (e) e.preventDefault();
    const pass = (passToTest || adminPassword).trim();
    if (!pass) {
      setAuthError("Please enter the administrator access password.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/c2c-apti-result?action=verify", {
        headers: { "x-admin-password": pass },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem(STORAGE_AUTH_KEY, pass);
        setIsAuthenticated(true);
        loadResults(pass, "live");
      } else {
        setAuthError(data.error || "Incorrect password. Access denied.");
      }
    } catch {
      setAuthError("Connection error while verifying authorization.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setIsAuthenticated(false);
    setAdminPassword("");
    setResults([]);
  };

  // Fetch Results with stored password
  const loadResults = useCallback(
    async (passOverride?: string, modeOverride?: "live" | "archive") => {
      const pass = passOverride || (typeof window !== "undefined" ? localStorage.getItem(STORAGE_AUTH_KEY) : "") || adminPassword;
      if (!pass) return;

      const currentMode = modeOverride || viewMode;
      const endpoint = currentMode === "archive" ? "/api/c2c-apti-result?view=archive" : "/api/c2c-apti-result";

      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          headers: { "x-admin-password": pass },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
          setStats(data.stats || null);
        }
      } catch (err) {
        console.error("Failed to load test results:", err);
      } finally {
        setLoading(false);
      }
    },
    [adminPassword, viewMode]
  );

  // Auto-login on mount if token exists
  useEffect(() => {
    const savedPass = localStorage.getItem(STORAGE_AUTH_KEY);
    if (savedPass) {
      setAdminPassword(savedPass);
      handleLogin(undefined, savedPass);
    }
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(() => {
      loadResults();
    }, 12000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, loadResults]);

  // Filter & Search Logic
  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        // Year filter
        if (activeTab !== "ALL" && r.normalizedCategory !== activeTab) {
          return false;
        }

        // Search term
        if (!searchTerm.trim()) return true;
        const s = searchTerm.toLowerCase();
        return (
          r.name.toLowerCase().includes(s) ||
          r.username.toLowerCase().includes(s) ||
          r.branch.toLowerCase().includes(s) ||
          r.lab.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => {
        if (sortBy === "rank") return a.rank - b.rank;
        if (sortBy === "time") return a.timeSpentMins - b.timeSpentMins;
        if (sortBy === "violations") return b.violations - a.violations;
        if (sortBy === "recent") {
          return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
        }
        return 0;
      });
  }, [results, activeTab, searchTerm, sortBy]);

  // Format export URL with current password & active filter
  const exportUrl = useMemo(() => {
    const pass = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_AUTH_KEY) || adminPassword) : adminPassword;
    const viewParam = viewMode === "archive" ? "&view=archive" : "";
    return `/api/c2c-apti-result?format=csv&filter=${activeTab}&password=${encodeURIComponent(pass)}${viewParam}`;
  }, [adminPassword, activeTab, viewMode]);

  const toggleViewMode = () => {
    const nextMode = viewMode === "live" ? "archive" : "live";
    setViewMode(nextMode);
    loadResults(undefined, nextMode);
  };

  return (
    <>
      <Head>
        <title>C2C Aptitude Evaluation Portal 2026 | Live Results & Leaderboard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Glow ambient background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px]" />
        </div>

        {/* 1. PASSWORD ACCESS SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-950/50">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 shadow-lg shadow-indigo-500/30 mb-5">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  C2C Aptitude Evaluation Portal
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Protected Admin Dashboard for live test results, grading audit, and batch score sheets.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Enter Admin Security Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter access password..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      autoFocus
                    />
                    <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  </div>
                  {authError && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:opacity-95 disabled:opacity-50"
                >
                  {authLoading ? "Authenticating..." : "Unlock Results Dashboard"}
                </button>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-500">
                    CSI KKWIEER Student Branch &bull; Confidential Assessment Records
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* 2. AUTHENTICATED RESULTS DASHBOARD */
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Top Navigation / Header */}
            <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full ${
                      viewMode === "live"
                        ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"
                        : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      viewMode === "live" ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {viewMode === "live" ? "2026 Live Session Active" : "Historical 2025 Archive View"}
                  </span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  {viewMode === "live" ? "C2C Aptitude Master Results 2026" : "C2C 2025 Assessment Archive"}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  {viewMode === "live"
                    ? "Live leaderboard for this year's candidates (FY, SY, TY & Final Year). Old records excluded."
                    : "Archived historical scores from the previous 2025 event for reference."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Archive / Live Switch Toggle */}
                <button
                  onClick={toggleViewMode}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                    viewMode === "archive"
                      ? "border-emerald-600/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                  title={viewMode === "live" ? "View previous 2025 test archives" : "Switch back to active 2026 test"}
                >
                  <span>{viewMode === "live" ? "📁 View 2025 Archive" : "⚡ Back to 2026 Live"}</span>
                </button>

                {/* Auto-Refresh Toggle (only in live mode) */}
                {viewMode === "live" && (
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                      autoRefresh
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                    title="Auto-refresh every 12 seconds during active test batches"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? "animate-spin text-emerald-400" : ""}`} />
                    <span>{autoRefresh ? "Auto (12s) ON" : "Auto-Refresh"}</span>
                  </button>
                )}

                {/* Manual Refresh */}
                <button
                  onClick={() => loadResults()}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
                  <span>Refresh</span>
                </button>

                {/* CSV Download */}
                <a
                  href={exportUrl}
                  download
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:opacity-95 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export {activeTab === "ALL" ? "All" : activeTab} CSV</span>
                </a>

                {/* Admin Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-900/50 transition"
                  title="Lock Dashboard"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Lock</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Stats Cards */}
            {stats && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Submissions</span>
                    <Users className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white">{stats.overall.total}</p>
                  <p className="mt-1 text-[11px] text-slate-500">Across all years</p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">First Year (FY)</span>
                    <span className="rounded bg-sky-950 px-1.5 py-0.5 text-[10px] font-bold text-sky-400">FY</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-sky-400">{stats.FY.count}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Avg: {stats.FY.avg} &bull; Top: {stats.FY.highest}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Second Year (SY)</span>
                    <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">SY</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">{stats.SY.count}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Avg: {stats.SY.avg} &bull; Top: {stats.SY.highest}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Third Year (TY)</span>
                    <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">TY</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-purple-400">{stats.TY.count}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Avg: {stats.TY.avg} &bull; Top: {stats.TY.highest}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Final Year</span>
                    <span className="rounded bg-amber-950 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">Final</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-400">{stats["Final Year"].count}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Avg: {stats["Final Year"].avg} &bull; Top: {stats["Final Year"].highest}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Top Test Score</span>
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-400">
                    {stats.overall.highestScore} <span className="text-xs font-normal text-slate-400">/50</span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">Avg Time: {stats.overall.averageTimeMins}m</p>
                </div>
              </div>
            )}

            {/* 4-Tier Filtering Bar + Search + Sorting */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
              {/* Year Filter Tabs: FY, SY, TY, Final Year */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ALL", label: "All Candidates", count: results.length },
                  { id: "FY", label: "First Year (FY)", count: stats?.FY.count || 0 },
                  { id: "SY", label: "Second Year (SY)", count: stats?.SY.count || 0 },
                  { id: "TY", label: "Third Year (TY)", count: stats?.TY.count || 0 },
                  { id: "Final Year", label: "Final Year", count: stats?.["Final Year"].count || 0 },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          isActive ? "bg-indigo-900/60 text-white" : "bg-slate-700/80 text-slate-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidate, PRN, branch..."
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                >
                  <option value="rank">Sort: Rank (Score & Time)</option>
                  <option value="time">Sort: Fastest Time</option>
                  <option value="violations">Sort: Violations Count</option>
                  <option value="recent">Sort: Most Recent</option>
                </select>
              </div>
            </div>

            {/* Main Results Table */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur-sm">
              {loading && results.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-b-2 border-indigo-500 mb-4" />
                  <p className="text-sm text-slate-400">Loading student assessment submissions...</p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="py-24 text-center px-4">
                  <Users className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                  <h3 className="text-base font-semibold text-slate-300">
                    {viewMode === "live" ? "Ready for 2026 Test Session" : "No Archived Records Found"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                    {searchTerm
                      ? `No test entries matched "${searchTerm}". Try a different keyword.`
                      : viewMode === "live"
                      ? "Last year's records are archived. As new students in Batch 1 & 2 submit their tests, their new scores, times, and rankings (#1, #2, #3...) will appear here live."
                      : `No historical 2025 records found for ${activeTab}.`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-5 py-4">Rank</th>
                        <th className="px-5 py-4">Candidate Details</th>
                        <th className="px-5 py-4">Category / Branch</th>
                        <th className="px-5 py-4">Lab / Room</th>
                        <th className="px-5 py-4 text-center">Score</th>
                        <th className="px-5 py-4 text-center">Percentage</th>
                        <th className="px-5 py-4 text-center">Time Spent</th>
                        <th className="px-5 py-4 text-center">Violations</th>
                        <th className="px-5 py-4">Submitted At</th>
                        <th className="px-5 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredResults.map((candidate, idx) => {
                        const rankNumber = idx + 1;
                        const isTop1 = rankNumber === 1;
                        const isTop2 = rankNumber === 2;
                        const isTop3 = rankNumber === 3;

                        // Year badge colors
                        const catColor =
                          candidate.normalizedCategory === "Final Year"
                            ? "bg-amber-950/80 text-amber-300 border-amber-800/40"
                            : candidate.normalizedCategory === "TY"
                            ? "bg-purple-950/80 text-purple-300 border-purple-800/40"
                            : candidate.normalizedCategory === "SY"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/40"
                            : "bg-sky-950/80 text-sky-300 border-sky-800/40";

                        return (
                          <tr
                            key={candidate.id || candidate.username}
                            className="transition hover:bg-slate-800/40 group"
                          >
                            {/* Rank */}
                            <td className="px-5 py-4 whitespace-nowrap font-bold">
                              {isTop1 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-amber-400 border border-amber-500/30">
                                  🥇 1st
                                </span>
                              ) : isTop2 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-300/10 px-2.5 py-1 text-slate-300 border border-slate-300/30">
                                  🥈 2nd
                                </span>
                              ) : isTop3 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700/10 px-2.5 py-1 text-amber-600 border border-amber-700/30">
                                  🥉 3rd
                                </span>
                              ) : (
                                <span className="text-slate-500 font-mono">#{rankNumber}</span>
                              )}
                            </td>

                            {/* Candidate Details */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="font-semibold text-white group-hover:text-indigo-400 transition">
                                {candidate.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {candidate.username}
                              </div>
                            </td>

                            {/* Year / Branch */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span
                                className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${catColor}`}
                              >
                                {candidate.normalizedCategory}
                              </span>
                              <div className="mt-1 text-[11px] text-slate-400">
                                {candidate.branch || "General"}
                              </div>
                            </td>

                            {/* Lab */}
                            <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                              {candidate.lab || "Online"}
                            </td>

                            {/* Score */}
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <div className="text-sm font-extrabold text-white">
                                {candidate.score}{" "}
                                <span className="text-[11px] font-normal text-slate-500">
                                  /{candidate.totalQuestions}
                                </span>
                              </div>
                            </td>

                            {/* Percentage */}
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  candidate.percentage >= 70
                                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                                    : candidate.percentage >= 40
                                    ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/40"
                                    : "bg-rose-950/80 text-rose-300 border border-rose-800/40"
                                }`}
                              >
                                {candidate.percentage}%
                              </span>
                            </td>

                            {/* Time Spent */}
                            <td className="px-5 py-4 whitespace-nowrap text-center font-mono text-slate-400">
                              {candidate.timeSpentMins} mins
                            </td>

                            {/* Violations */}
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              {candidate.violations > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-800/40">
                                  <AlertTriangle className="h-3 w-3" />
                                  {candidate.violations} Tab Swaps
                                </span>
                              ) : (
                                <span className="text-emerald-400/80 inline-flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="h-3 w-3" /> 0
                                </span>
                              )}
                            </td>

                            {/* Submission Date */}
                            <td className="px-5 py-4 whitespace-nowrap text-[11px] text-slate-400">
                              {candidate.submittedAt
                                ? new Date(candidate.submittedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </td>

                            {/* Action */}
                            <td className="px-5 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-indigo-500 hover:text-white transition"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Candidate Inspection Modal */}
            {selectedCandidate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedCandidate.name}</h3>
                      <p className="text-xs font-mono text-slate-400">{selectedCandidate.username}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Year Category</span>
                      <p className="mt-1 font-semibold text-white">{selectedCandidate.normalizedCategory}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Department / Branch</span>
                      <p className="mt-1 font-semibold text-white">{selectedCandidate.branch || "General"}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Allocated Lab</span>
                      <p className="mt-1 font-semibold text-white">{selectedCandidate.lab || "Online"}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Final Score</span>
                      <p className="mt-1 font-bold text-emerald-400 text-sm">
                        {selectedCandidate.score} / {selectedCandidate.totalQuestions} ({selectedCandidate.percentage}%)
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Time Taken</span>
                      <p className="mt-1 font-semibold text-white">{selectedCandidate.timeSpentMins} minutes</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                      <span className="text-slate-500">Tab Violations</span>
                      <p className="mt-1 font-semibold text-white">
                        {selectedCandidate.violations === 0 ? "0 (Clean)" : `${selectedCandidate.violations} violations`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 font-mono">
                    <div>Client IP: {selectedCandidate.ip || "Direct"}</div>
                    <div className="mt-1">
                      Submitted:{" "}
                      {selectedCandidate.submittedAt
                        ? new Date(selectedCandidate.submittedAt).toLocaleString("en-IN")
                        : "N/A"}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
