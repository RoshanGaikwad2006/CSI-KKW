import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
  ArrowLeft,
  QrCode,
  Upload,
  X,
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
  paymentScreenshot: "",
};

const SESSION_PLAN = [
  {
    day: "Day 1",
    title: "SIH (Smart India Hackathon)",
    subtitle: "Problem statement analysis, ideation, team formation & hackathon strategy",
  },
  {
    day: "Day 2",
    title: "Placement & Career Guidance",
    subtitle: "Resume optimization, interview preparation, tech stacks & campus drive insights",
  },
  {
    day: "Day 3",
    title: "AI Tools & Workflows",
    subtitle: "Hands-on exposure to modern generative AI, developer tools & productivity workflows",
  },
  {
    day: "Day 4",
    title: "GATE – Information & Guidance",
    subtitle: "Exam pattern breakdown, preparation roadmap, PSUs & higher studies guidance",
  },
  {
    day: "Day 5",
    title: "Soft Skills & Professional Grooming",
    subtitle: "Effective communication, public speaking, leadership & team collaboration",
  },
];


const EVENT_DETAILS = [
  { label: "DATE", value: "Mar 10 – 15, 2026" },
  { label: "TIME", value: "" },
  { label: "VENUE", value: "Online" },
  { label: "ELIGIBILITY", value: "All Branches & Academic Years" }
];

export default function VisionWeekRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Payment screenshot image size must be under 10MB.");
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (error) setError(null);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
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

    if (!screenshotPreview) {
      setError("Please upload your Payment Transaction Screenshot before submitting.");
      setLoading(false);
      return;
    }

    try {
      let uploadedScreenshotUrl = "";

      // Upload Payment Screenshot to ImgBB
      if (screenshotPreview) {
        try {
          const uploadRes = await fetch("/api/upload-payment-ss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: screenshotPreview }),
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            uploadedScreenshotUrl = uploadData.url;
          }
        } catch (uploadErr) {
          console.warn("Screenshot upload fallback notice:", uploadErr);
          uploadedScreenshotUrl = screenshotPreview;
        }
      }

      const payload = {
        ...formData,
        paymentScreenshot: uploadedScreenshotUrl || screenshotPreview || "",
      };

      const res = await fetch("/api/vision-week-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  return (
    <>
      <Head>
        <title>Vision Week 2026 Registration | CSI KKWIEER</title>
        <meta
          name="description"
          content="Register for Vision Week 2026 — 5 Days Sessions on SIH, Placement Guidance, AI Tools, GATE Prep & Soft Skills by CSI KKWIEER."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-900 pb-12">
        {/* ── Outer Layout Wrapper ── */}
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">

          {/* Back Button Link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-[#1D68F2] mb-4 transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </button>

          {/* ── TOP BANNER CARD ── */}
          <div className="bg-gradient-to-r from-[#0A192F] via-[#0F2748] to-[#0A192F] text-white rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#1D68F2]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                  VISION WEEK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">2026</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 font-sans">
                  Mar 10 – 15, 2026
                </span>
              </div>
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
                  <h2 className="text-xl font-bold text-[#0A192F] mb-2 font-display">
                    REGISTRATION CONFIRMED
                  </h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed font-sans">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>.
                    Your registration for Vision Week 2026 has been recorded.
                  </p>

                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 text-xs text-slate-700 space-y-2 font-sans">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-semibold text-slate-500">NAME</span>
                      <span className="font-bold text-slate-900">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-semibold text-slate-500">EMAIL</span>
                      <span className="font-bold text-slate-900">{formData.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-semibold text-slate-500">PHONE</span>
                      <span className="font-bold text-slate-900">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">PAYMENT PROOF</span>
                      <span className="font-bold text-emerald-700">ATTACHED ✓</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full font-sans">
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
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
                    className="text-xs text-[#1D68F2] hover:underline font-bold mt-4 font-sans"
                  >
                    Register another student
                  </button>
                </div>
              ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 font-sans">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Name Surname"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  {/* Branch / Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                        DEPARTMENT
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
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
                      <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                        ACADEMIC YEAR
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
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
                      <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                        COLLEGE NAME
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                        ROLL / PRN
                      </label>
                      <input
                        type="text"
                        name="prn"
                        value={formData.prn}
                        onChange={handleChange}
                        placeholder="21U123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1.5">
                      PAYMENT SCREENSHOT <span className="text-red-500">*</span>
                    </label>

                    {!screenshotPreview ? (
                      <label className="border-2 border-dashed border-slate-300 hover:border-[#1D68F2] bg-slate-50/70 hover:bg-slate-100/70 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#1D68F2] mb-1.5 transition-colors" />
                        <span className="text-xs font-semibold text-slate-700 font-sans">
                          Upload Transaction Screenshot
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 font-sans">
                          PNG, JPG or WEBP (Max 10MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                          <img
                            src={screenshotPreview}
                            alt="Payment Screenshot Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Screenshot Attached</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                            {screenshotFile ? screenshotFile.name : "screenshot.jpg"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
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

            {/* ── RIGHT COLUMN: Payment, Event Details & Session Plan (7 cols) ── */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Sub-grid: PAYMENT CARD (5 cols) + EVENT DETAILS & SESSION PLAN CARD (7 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* 1. PAYMENT CARD */}
                <div className="md:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col items-center text-center">
                  <h2 className="w-full text-sm font-bold text-[#0A192F] font-display tracking-wider uppercase mb-4 pb-2 border-b border-slate-200 text-left">
                    PAYMENT
                  </h2>

                  <div className="flex flex-col items-center gap-4 my-2">
                    <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center relative overflow-hidden shadow-xs">
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
                        <QrCode className="w-12 h-12 opacity-30 mb-2" />
                        <span className="text-xs font-sans font-semibold text-slate-500">Scan QR Code</span>
                      </div>
                    </div>

                    <span className="inline-block bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs uppercase px-4 py-1.5 rounded-lg font-sans">
                      ENTRY FEE: ₹50
                    </span>

                    <p className="text-[11px] text-slate-500 mt-1 font-sans leading-snug">
                      Scan QR code to pay entry fee &amp; attach transaction screenshot in form.
                    </p>
                  </div>
                </div>

                {/* 2. EVENT DETAILS & SESSION PLAN CARD */}
                <div className="md:col-span-7 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
                  {/* Basic Event Details */}
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F] font-display tracking-wider uppercase mb-3 pb-2 border-b border-slate-200">
                      EVENT DETAILS
                    </h2>

                    <div className="divide-y divide-slate-100 text-xs font-sans">
                      {EVENT_DETAILS.map(({ label, value }) => (
                        <div key={label} className="py-2 flex justify-between items-center gap-2">
                          <span className="font-semibold text-slate-500 tracking-wider text-[11px]">{label}</span>
                          <span className="font-bold text-[#0A192F] text-right text-[11px]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5-Day Session Plan Section inside Event Details */}
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F] font-display tracking-wider uppercase mb-3 pb-2 border-b border-slate-200">
                      5-DAY SESSION PLAN
                    </h3>

                    <div className="space-y-2 font-sans">
                      {SESSION_PLAN.map(({ day, title, subtitle }) => (
                        <div
                          key={day}
                          className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 shrink-0 font-sans">
                              {day}
                            </span>
                            <h4 className="text-xs font-bold text-[#0A192F] font-sans truncate">{title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}


