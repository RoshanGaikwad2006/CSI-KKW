import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Clock,
  Users,
  QrCode,
  IndianRupee,
  Code,
  Briefcase,
  Cpu,
  GraduationCap,
  MessageSquare,
  Award,
  PhoneCall,
} from "lucide-react";
import { Button } from "../src/components/ui/button";

const DEFAULT_FORM = {
  fullName: "",
  email: "",
  phone: "",
  college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
  department: "Computer Engineering",
  year: "Third Year (TE)",
  prn: "",
  track: "All 5 Days Access Pass (Recommended)",
  comments: "",
};

const SESSION_PLAN = [
  {
    day: "Day 1",
    title: "SIH (Smart India Hackathon)",
    subtitle: "Problem statement analysis, ideation, team formation & hackathon strategy",
    icon: Code,
    badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    day: "Day 2",
    title: "Placement & Career Guidance",
    subtitle: "Resume optimization, interview preparation, tech stacks & campus drive insights",
    icon: Briefcase,
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    day: "Day 3",
    title: "AI Tools & Workflows",
    subtitle: "Hands-on exposure to modern generative AI, developer tools & productivity workflows",
    icon: Cpu,
    badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    day: "Day 4",
    title: "GATE – Information & Guidance",
    subtitle: "Exam pattern breakdown, preparation roadmap, PSUs & higher studies guidance",
    icon: GraduationCap,
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    day: "Day 5",
    title: "Soft Skills & Professional Grooming",
    subtitle: "Effective communication, public speaking, leadership & team collaboration",
    icon: MessageSquare,
    badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
];


const EVENT_DETAILS = [
  { label: "DATE", value: "Mar 10 – 15, 2026" },
  { label: "TIME", value: "9:00 AM – 4:00 PM" },
  { label: "VENUE", value: "Main Auditorium, KKWIEER" },
  { label: "ELIGIBILITY", value: "All Branches & Academic Years" },
  { label: "PERKS", value: "Official CSI Certificate & Study Kit" },
];

export default function VisionWeekRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all mandatory fields (Full Name, Email Address, WhatsApp Phone).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/vision-week-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Submission could not be recorded. Please try again.");
      }
    } catch (err: any) {
      console.error("Vision Week registration error:", err);
      setError("Network connection issue. Please verify your internet connection or retry.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setFormData(DEFAULT_FORM);
  };

  return (
    <>
      <Head>
        <title>Vision Week 2026 Registration | CSI KKWIEER</title>
        <meta
          name="description"
          content="Register for Vision Week 2026 — 5 Days Sessions on SIH, Placement Guidance, AI Tools, GATE Prep & Soft Skills by CSI KKWIEER."
        />
      </Head>

      <div className="min-h-screen bg-slate-100 flex flex-col font-mono text-slate-900 pb-12">
        {/* ── Outer Layout Wrapper ── */}
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">

          {/* Back Button Link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#1D68F2] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO EVENTS</span>
          </button>

          {/* ── TOP BANNER CARD ── */}
          <div className="bg-[#0A192F] text-white rounded-2xl p-4 sm:p-6 mb-5 border border-slate-800 shadow-md relative overflow-hidden">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-mono text-white flex items-center gap-3">
                <span className="text-[#1D68F2] font-mono">&gt;</span> VISION_WEEK_2026
              </h1>
            </div>
          </div>

          {/* ── TWO COLUMN LAYOUT: Form on Left (5 cols), Details on Right (7 cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── LEFT COLUMN: Registration Form (5 cols) ── */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-sm p-5 sm:p-6">
              {submitted ? (
                /* SUCCESS STATE */
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0A192F] mb-2 font-mono">
                    REGISTRATION CONFIRMED
                  </h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>.
                    Your registration for Vision Week 2026 has been recorded.
                  </p>

                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 text-xs text-slate-700 space-y-2">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-500">NAME</span>
                      <span className="font-semibold text-slate-900">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-500">EMAIL</span>
                      <span className="font-semibold text-slate-900">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">PHONE</span>
                      <span className="font-semibold text-slate-900">{formData.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <span>Download Schedule</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Button
                      onClick={() => router.push("/")}
                      variant="outline"
                      className="w-full py-2.5 rounded-xl border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider"
                    >
                      Back to Home
                    </Button>
                  </div>

                  <button
                    onClick={resetForm}
                    className="text-xs text-[#1D68F2] hover:underline font-bold mt-4"
                  >
                    Register another student
                  </button>
                </div>
              ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Name Surname"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Branch / Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                        DEPARTMENT
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      >
                        <option value="Computer Engineering">Computer Engg</option>
                        <option value="Information Technology">IT</option>
                        <option value="AIDS">AIDS</option>
                        <option value="E&TC">E&amp;TC</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                        ACADEMIC YEAR
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      >
                        <option value="First Year (FE)">FE</option>
                        <option value="Second Year (SE)">SE</option>
                        <option value="Third Year (TE)">TE</option>
                        <option value="Final Year (BE)">BE</option>
                      </select>
                    </div>
                  </div>

                  {/* College & Roll No / PRN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                        COLLEGE NAME
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                        ROLL / PRN
                      </label>
                      <input
                        type="text"
                        name="prn"
                        value={formData.prn}
                        onChange={handleChange}
                        placeholder="21U123"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* ── RIGHT COLUMN: Payment, Event Details & 5-Day Session Plan (7 cols) ── */}
            <div className="lg:col-span-7 flex flex-col gap-5">

              {/* Sub-grid: PAYMENT + EVENT DETAILS side by side */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                {/* 1. PAYMENT CARD */}
                <div className="md:col-span-6 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col items-center text-center">
                  <h2 className="w-full text-lg font-bold text-[#0A192F] font-mono tracking-tight mb-4 pb-2 border-b border-slate-200 text-left">
                    PAYMENT
                  </h2>

                  <div className="flex flex-col items-center gap-4 my-2">
                    <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-2xl border-2 border-slate-300 bg-slate-50 p-2.5 flex items-center justify-center relative overflow-hidden shadow-sm">
                      <img
                        src="/images/payment-qr.png"
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                        }}
                      />
                      <div className="absolute inset-0 hidden flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <QrCode className="w-16 h-16 opacity-30 mb-2" />
                        <span className="text-xs font-mono font-semibold text-slate-500">Scan QR Code</span>
                      </div>
                    </div>

                    <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm uppercase px-4 py-1.5 rounded-lg shadow-xs">
                      ENTRY FEE: 50 Rs
                    </span>
                  </div>
                </div>

                {/* 2. EVENT DETAILS CARD */}
                <div className="md:col-span-6 bg-white rounded-2xl border border-slate-300 shadow-sm p-5">
                  <h2 className="text-base font-bold text-[#0A192F] font-mono tracking-tight mb-3 pb-2 border-b border-slate-200">
                    EVENT DETAILS
                  </h2>

                  <div className="divide-y divide-slate-100 text-xs font-mono">
                    {EVENT_DETAILS.map(({ label, value }) => (
                      <div key={label} className="py-1.5 flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-500 tracking-wider text-[11px]">{label}</span>
                        <span className="font-semibold text-[#0A192F] text-right text-[11px]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. 5-DAY SESSION PLAN CARD */}
              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5">
                <h2 className="text-base font-bold text-[#0A192F] font-mono tracking-tight mb-3 pb-2 border-b border-slate-200">
                  5-DAY SESSION PLAN
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  {SESSION_PLAN.map(({ day, title, subtitle, icon: Icon, badgeBg }, idx) => (
                    <div
                      key={day}
                      className={`p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-2.5 ${idx === 4 ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#1D68F2] mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${badgeBg}`}>
                            {day}
                          </span>
                          <h3 className="text-xs font-bold text-[#0A192F]">{title}</h3>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}


