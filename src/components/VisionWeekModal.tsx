import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

interface VisionWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisionWeekModal: React.FC<VisionWeekModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
    department: "Computer Engineering",
    year: "Third Year (TE)",
    prn: "",
    track: "CodeVerse Hackathon",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic frontend validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required fields (Name, Email, Phone).");
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
      // Even if network glitches, confirm fallback or display informative error
      setError("Network connection issue. Please verify your connection or retry.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
      department: "Computer Engineering",
      year: "Third Year (TE)",
      prn: "",
      track: "All 5 Days Access Pass (Recommended)",
      comments: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header — Solid Navy (No Gradient) */}
        <div className="relative bg-[#0A192F] text-white p-6 sm:p-7 pr-14 flex-shrink-0 border-b border-slate-800">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D68F2] text-white text-[11px] font-bold tracking-widest uppercase mb-2.5 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CSI KKWIEER Flagship Event</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Vision Week 2026
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            5-Day Career Elevation &amp; Skill Building Conclave
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>March 10 – 15, 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>Campus Wide &amp; Advanced Labs</span>
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-900">
          {submitted ? (
            /* SUCCESS STATE */
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mb-4 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A192F] mb-2">
                Registration Confirmed!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your registration for <strong className="text-[#1D68F2]">{formData.track}</strong> at Vision Week 2026 has been recorded successfully.
              </p>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 text-xs text-slate-700 space-y-1.5">
                <div><span className="font-semibold text-slate-500">Candidate Email:</span> {formData.email}</div>
                <div><span className="font-semibold text-slate-500">Phone:</span> {formData.phone}</div>
                <div><span className="font-semibold text-slate-500">Pass Type:</span> {formData.track}</div>
                <div><span className="font-semibold text-slate-500">College:</span> {formData.college}</div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <span>Download Schedule</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-slate-300 text-slate-700 font-semibold"
                >
                  Done
                </Button>
              </div>

              <button
                onClick={resetForm}
                className="text-xs text-[#1D68F2] hover:underline font-semibold mt-4"
              >
                Register another candidate
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@kkwagh.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Session Track Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                  Select Session Pass <span className="text-red-500">*</span>
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-blue-50/40 text-sm font-semibold text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                >
                  <option value="All 5 Days Access Pass (Recommended)">✨ All 5 Days Access Pass (Recommended — ₹99)</option>
                  <option value="Day 1: SIH (Smart India Hackathon)">Day 1: SIH (Smart India Hackathon)</option>
                  <option value="Day 2: Placement & Career Guidance">Day 2: Placement & Career Guidance</option>
                  <option value="Day 3: AI Tools">Day 3: AI Tools</option>
                  <option value="Day 4: GATE – Information & Guidance">Day 4: GATE – Information & Guidance</option>
                  <option value="Day 5: Soft Skills">Day 5: Soft Skills</option>
                </select>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  >
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence &amp; Data Science</option>
                    <option value="Electronics & Telecommunication">Electronics &amp; Telecommunication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Other Department">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  >
                    <option value="First Year (FE)">First Year (FE)</option>
                    <option value="Second Year (SE)">Second Year (SE)</option>
                    <option value="Third Year (TE)">Third Year (TE)</option>
                    <option value="Final Year (BE)">Final Year (BE)</option>
                  </select>
                </div>
              </div>

              {/* College Name & PRN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                    Roll No / PRN
                  </label>
                  <input
                    type="text"
                    name="prn"
                    value={formData.prn}
                    onChange={handleChange}
                    placeholder="e.g. 21U123"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                  Remarks / Expectations (Optional)
                </label>
                <textarea
                  name="comments"
                  rows={2}
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Mention any queries or expectations..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  🔒 Data is securely recorded and synced to the CSI Coordinator Google Drive / Sheets.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionWeekModal;
