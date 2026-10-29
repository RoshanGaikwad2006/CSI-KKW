import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SEO from "../src/components/SEO";
import {
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Upload,
  X,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "../src/components/ui/button";

const DEFAULT_FORM = {
  fullName: "",
  email: "",
  phone: "",
  college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
  department: "",
  year: "Third Year (TE)",
  upiId: "",
  comments: "",
  paymentScreenshot: "",
};

const EVENT_DETAILS = [
  { label: "EVENT", value: "From Campus to Corporate 5.0" },
  { label: "DATE", value: "27 Oct 2026" },
  { label: "INSTITUTE", value: "KKWIEER, Nashik" },
  { label: "STATUS", value: "Concluded" },
  { label: "ORGANIZER", value: "CSI Students' Chapter Nashik 2026-27" },
];

const EVENT_ROUNDS = [
  {
    module: "Round 01",
    title: "Aptitude & Technical Test",
    desc: "Quantitative & logical aptitude test combined with technical core assessment & problem-solving.",
  },
  {
    module: "Round 02",
    title: "Group Discussion",
    desc: "Structured corporate GD evaluation focusing on communication skills, articulation, teamwork, and critical analysis.",
  },
  {
    module: "Round 03",
    title: "Technical & HR Interview",
    desc: "Comprehensive technical interview panel evaluating core skills and projects, followed by HR behavioral assessment.",
  },
];

export default function C2CRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [otherCollege, setOtherCollege] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [otherYear, setOtherYear] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const compressImage = (
    file: File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.72
  ): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = (event.target?.result as string) || "";
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          } else {
            resolve((event.target?.result as string) || "");
          }
        };
        img.onerror = () => resolve((event.target?.result as string) || "");
      };
      reader.onerror = () => resolve("");
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError("Payment screenshot image size must be under 20MB.");
      return;
    }

    setScreenshotFile(file);
    try {
      const compressedDataUrl = await compressImage(file);
      setScreenshotPreview(compressedDataUrl);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    // Validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all mandatory fields (Full Name, Email Address, WhatsApp Phone).");
      setLoading(false);
      return;
    }

    if (!formData.department.trim()) {
      setError("Please select your Department.");
      setLoading(false);
      return;
    }

    if (formData.year === "Other" && !otherYear.trim()) {
      setError("Please specify your Academic Year or Course.");
      setLoading(false);
      return;
    }

    if (formData.department === "Other" && !otherDepartment.trim()) {
      setError("Please specify your Department name.");
      setLoading(false);
      return;
    }

    if (formData.college === "Other" && !otherCollege.trim()) {
      setError("Please specify your College / Institute full name.");
      setLoading(false);
      return;
    }

    if (!formData.upiId.trim()) {
      setError("Please enter your UPI ID or Transaction ID (UTR).");
      setLoading(false);
      return;
    }

    if (!screenshotPreview) {
      setError("Please upload your Payment Transaction Screenshot before submitting.");
      setLoading(false);
      return;
    }

    try {
      const finalCollege =
        formData.college === "Other"
          ? otherCollege.trim() || "Other"
          : formData.college;

      const finalYear =
        formData.year === "Other"
          ? otherYear.trim() || "Other"
          : formData.year;

      const finalDepartment =
        formData.department === "Other"
          ? otherDepartment.trim() || "Other"
          : formData.department;

      let uploadedScreenshotUrl = "";

      // Upload Payment Screenshot via /api/upload-payment-ss (Vision Week approach)
      if (screenshotPreview) {
        try {
          const uploadRes = await fetch("/api/upload-payment-ss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: screenshotPreview }),
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json().catch(() => null);
            if (uploadData && uploadData.success && uploadData.url) {
              uploadedScreenshotUrl = uploadData.url;
            }
          } else {
            const errText = await uploadRes.text().catch(() => "");
            console.warn("Upload payment ss notice:", uploadRes.status, errText);
          }
        } catch (uploadErr) {
          console.warn("Screenshot upload fallback notice:", uploadErr);
        }
      }

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: finalCollege,
        department: finalDepartment,
        year: finalYear,
        upiId: formData.upiId.trim(),
        comments: formData.comments.trim(),
        paymentScreenshot: uploadedScreenshotUrl || screenshotPreview || "",
      };

      const res = await fetch("/api/c2c-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        const rawText = await res.text().catch(() => "");
        console.warn("Non-JSON registration response:", rawText);
        data = { error: rawText || "Submission failed. Please try again." };
      }

      if (res.ok && data?.success) {
        setTicketId(data.ticketId || null);
        setSubmitted(true);
      } else {
        setError(data?.error || data?.message || "Submission could not be recorded. Please try again.");
      }
    } catch (err: any) {
      console.error("C2C 5.0 registration error:", err);
      setError("Network connection issue. Please verify your internet connection or retry.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setTicketId(null);
    setError(null);
    setOtherCollege("");
    setOtherDepartment("");
    setOtherYear("");
    setFormData(DEFAULT_FORM);
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  const finalCollegeDisplay =
    formData.college === "Other" ? otherCollege || "Other" : formData.college;
  const finalYearDisplay =
    formData.year === "Other" ? otherYear || "Other" : formData.year;
  const finalDeptDisplay =
    formData.department === "Other" ? otherDepartment || "Other" : formData.department;

  return (
    <>
      <SEO
        title="From Campus to Corporate 5.0 Registration"
        description="Register for From Campus to Corporate 5.0 — Flagship placement drive featuring Round 1 Apti & Coding (DSA), Round 2 GD, and Round 3 Technical & HR Interviews by CSI KKWIEER."
        canonical="/c2c-register"
        ogImage="/images/c2c.png"
        keywords={[
          "From Campus to Corporate 5.0",
          "C2C 5.0 Registration",
          "CSI KKWIEER",
          "Placement Mock Drive",
          "Coding DSA Assessment",
          "Group Discussion GD",
          "Technical HR Interview",
          "KKWIEER Nashik",
        ]}
      />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-900 pb-12">
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
          <div className="bg-gradient-to-r from-[#0A192F] via-[#0D2447] to-[#0A192F] text-white rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#1D68F2]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-1">
                  K. K. Wagh Institute of Engineering Education &amp; Research, Nashik • CSI Students' Chapter Nashik 2026-27
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                  FROM CAMPUS TO CORPORATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">5.0</span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-1">
                  LEARN • CONNECT • GROW • Bridging the gap between academic learning and the professional world.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-200">
                  DATE: 27 OCT 2026
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-200">
                  FLAGSHIP EVENT
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
                  EVENT CONCLUDED
                </span>
              </div>
            </div>
          </div>

          {/* ── TWO COLUMN LAYOUT: Form on Left (5 cols), Details on Right (7 cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN: Event Status (5 cols) ── */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-7 text-center font-sans">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold tracking-wider uppercase mb-3">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Event Concluded
              </div>

              <h2 className="text-2xl font-extrabold text-[#0A192F] font-display tracking-tight mb-2">
                Event Concluded
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                <strong className="text-slate-900">From Campus to Corporate 5.0</strong> has successfully concluded! Thank you to all student candidates, faculty coordinators, alumni mentors, and corporate panel members for making this flagship drive a massive success.
              </p>

              {/* Event Wrap-up & Certificates */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-700 space-y-3 mb-6">
                <div className="flex items-center gap-2 font-bold text-[#0A192F] pb-2 border-b border-slate-200">
                  <Sparkles className="w-4 h-4 text-[#1D68F2]" />
                  <span>Certificates &amp; Results</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-600 list-disc list-inside">
                  <li>Official CSI verified participation &amp; merit certificates will be issued to eligible attendees.</li>
                  <li>Round 01 Aptitude and Interview round performance assessments are completed and archived.</li>
                  <li>Stay connected with CSI KKWIEER for future hackathons, tech talks, and career conclaves.</li>
                </ul>
              </div>

              {/* Action Links */}
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => router.push("/events")}
                  variant="outline"
                  className="w-full py-2.5 rounded-xl border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider"
                >
                  Explore Other Events
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  variant="ghost"
                  className="w-full py-2 text-slate-500 hover:text-slate-900 font-semibold text-xs tracking-wider"
                >
                  Back to Home
                </Button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Event Details & Modules (7 cols) ── */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
                  {/* Event Details */}
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F] font-display tracking-wider uppercase mb-3 pb-2 border-b border-slate-200">
                      EVENT OVERVIEW
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

                  {/* Highlights / Modules */}
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F] font-display tracking-wider uppercase mb-3 pb-2 border-b border-slate-200">
                      SELECTION ROUNDS
                    </h3>

                    <div className="space-y-2.5 font-sans">
                      {EVENT_ROUNDS.map(({ module, title, desc }) => (
                        <div
                          key={module}
                          className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 shrink-0 font-sans">
                              {module}
                            </span>
                            <h4 className="text-xs font-bold text-[#0A192F] font-sans truncate">{title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Key Highlights from Official Poster */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-center font-sans">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A192F]">HR Round</p>
                          <p className="text-[9px] text-slate-500">Industry Evaluation</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A192F]">Internships</p>
                          <p className="text-[9px] text-slate-500">Industry Openings</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A192F]">Networking</p>
                          <p className="text-[9px] text-slate-500">Alumni &amp; Mentors</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A192F]">Placements</p>
                          <p className="text-[9px] text-slate-500">Corporate Hiring</p>
                        </div>
                      </div>

                      <a
                        href="/images/c2c-poster.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1D68F2] text-xs font-bold transition-colors"
                      >
                        <span>View Official Event Poster</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  );
}
