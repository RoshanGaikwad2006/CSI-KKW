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

const SESSIONS_LIST = [
  { id: "day1", day: "Day 1 (26 Sept)", title: "AI Tools & Workflows" },
  { id: "day2", day: "Day 2 (27 Sept)", title: "SIH (Smart India Hackathon)" },
  { id: "day3", day: "Day 3 (28 Sept)", title: "Placement & Career Guidance" },
  { id: "day4", day: "Day 4 (29 Sept)", title: "GATE – Information & Guidance" },
  { id: "day5", day: "Day 5 (30 Sept)", title: "Soft Skills & Professional Grooming" },
];

export const VisionWeekModal: React.FC<VisionWeekModalProps> = ({
  isOpen,
  onClose,
}) => {
  const allSessionLabels = SESSIONS_LIST.map((s) => `${s.day}: ${s.title}`);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
    department: "",
    year: "Third Year (TE)",
    prn: "",
    upiId: "",
    track: "",
    comments: "",
  });

  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAllSelected =
    selectedSessions.length === SESSIONS_LIST.length && SESSIONS_LIST.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(allSessionLabels);
    }
    if (error) setError(null);
  };

  const handleToggleSession = (sessionLabel: string) => {
    setSelectedSessions((prev) => {
      if (prev.includes(sessionLabel)) {
        return prev.filter((s) => s !== sessionLabel);
      } else {
        return [...prev, sessionLabel];
      }
    });
    if (error) setError(null);
  };

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
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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

    if (selectedSessions.length === 0) {
      setError("Please select at least one session to attend.");
      setLoading(false);
      return;
    }

    if (!formData.upiId.trim()) {
      setError("Please enter your UPI ID or Transaction ID (UTR).");
      setLoading(false);
      return;
    }

    try {
      const sessionsText =
        selectedSessions.length === SESSIONS_LIST.length
          ? "All 5 Days (Full Conclave)"
          : selectedSessions.join(", ");

      const payload = {
        ...formData,
        track: sessionsText,
        selectedSessions,
        upiId: formData.upiId.trim(),
      };

      const res = await fetch("/api/vision-week-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketId(data.ticketId || null);
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
    setTicketId(null);
    setError(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
      department: "",
      year: "Third Year (TE)",
      prn: "",
      upiId: "",
      track: "",
      comments: "",
    });
    setSelectedSessions([]);
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
              <span>September 26 – 30, 2026</span>
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
                {ticketId && (
                  <div className="flex justify-between border-b border-blue-200 bg-blue-50/80 -mx-4 -mt-4 px-4 py-2.5 rounded-t-2xl mb-1.5">
                    <span className="font-semibold text-blue-700">Ticket ID:</span>
                    <span className="font-mono font-extrabold text-[#1D68F2] tracking-wider">{ticketId}</span>
                  </div>
                )}
                <div><span className="font-semibold text-slate-500">Candidate Email:</span> {formData.email}</div>
                <div><span className="font-semibold text-slate-500">Phone:</span> {formData.phone}</div>
                <div><span className="font-semibold text-slate-500">Sessions:</span> {selectedSessions.length === SESSIONS_LIST.length ? "All 5 Days (Full Conclave)" : selectedSessions.join(", ")}</div>
                <div><span className="font-semibold text-slate-500">UPI ID / UTR:</span> {formData.upiId}</div>
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

              {/* Sessions Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">
                    Sessions Attending <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-[11px] font-bold text-[#1D68F2] hover:underline"
                  >
                    {isAllSelected ? "Deselect All" : "Select All (5 Days)"}
                  </button>
                </div>

                <div className="space-y-1.5 border border-slate-300 bg-slate-50/50 rounded-xl p-2.5">
                  {/* All 5 Days Quick Select Option */}
                  <label
                    onClick={handleToggleAll}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border text-xs ${
                      isAllSelected
                        ? "bg-blue-50/90 border-blue-300 text-[#0A192F] font-bold"
                        : "bg-white/70 border-slate-200 text-slate-700 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="w-3.5 h-3.5 rounded text-[#1D68F2] accent-[#1D68F2] cursor-pointer"
                      />
                      <span>All 5 Days (Full Conclave)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1D68F2]">
                      RECOMMENDED
                    </span>
                  </label>

                  {/* Individual Days */}
                  <div className="grid grid-cols-1 gap-1 pt-0.5">
                    {SESSIONS_LIST.map((s) => {
                      const label = `${s.day}: ${s.title}`;
                      const isChecked = selectedSessions.includes(label);
                      return (
                        <label
                          key={s.id}
                          onClick={() => handleToggleSession(label)}
                          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all border text-xs ${
                            isChecked
                              ? "bg-white border-blue-200 text-[#0A192F] font-semibold"
                              : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSession(label)}
                            className="w-3.5 h-3.5 rounded text-[#1D68F2] accent-[#1D68F2] cursor-pointer"
                          />
                          <span className="truncate">{s.day}: {s.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
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
                    <option value="">Select Department</option>
                    <option value="Computer">Computer</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="AIDS">AIDS</option>
                    <option value="E&TC">E&amp;TC</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Robotics & Automation">Robotics &amp; Automation</option>
                    <option value="Other">Other</option>
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

              {/* UPI ID / UTR */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                  UPI ID / TRANSACTION ID (UTR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="upiId"
                  required
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. 408212345678 or student@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Entry fee: ₹50. Please enter the 12-digit UTR/Ref number or UPI ID used to pay.
                </p>
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
