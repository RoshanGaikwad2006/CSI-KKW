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
  { id: "day1", day: "Day 1 (26 Sept)", title: "AI Tools" },
  { id: "day2", day: "Day 2 (27 Sept)", title: "SIH Session" },
  { id: "day3", day: "Day 3 (28 Sept)", title: "Placement Roadmap" },
  { id: "day4", day: "Day 4 (29 Sept)", title: "Expert Session" },
  { id: "day5", day: "Day 5 (30 Sept)", title: "Higher Studies" },
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
  const [otherDepartment, setOtherDepartment] = useState("");
  const [otherCollege, setOtherCollege] = useState("");
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
        college: formData.college === "Other" ? (otherCollege.trim() || "Other") : formData.college,
        department: formData.department === "Other" ? (otherDepartment.trim() || "Other") : formData.department,
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
    setOtherDepartment("");
    setOtherCollege("");
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
            Smarter Skills, Brighter Career • Explore • Create • Work Smarter
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>September 26 – 30, 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>Online Sessions</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span>Fee: ₹50</span>
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
                <div><span className="font-semibold text-slate-500">Sessions:</span> {selectedSessions.length === SESSIONS_LIST.length ? "All 5 Days (Full Conclave)" : selectedSessions.join(", ")}</div>
                <div><span className="font-semibold text-slate-500">UPI ID / UTR:</span> {formData.upiId}</div>
                <div><span className="font-semibold text-slate-500">College:</span> {formData.college === "Other" ? (otherCollege || "Other") : formData.college}</div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <a
                  href="https://chat.whatsapp.com/E8rTeMVGUwkLMqo6pecxzZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Join WhatsApp Group</span>
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
                    <option value="CSD">CSD</option>
                    <option value="E&TC">E&amp;TC</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Robotics & Automation">Robotics &amp; Automation</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.department === "Other" && (
                    <input
                      type="text"
                      placeholder="Enter your department"
                      value={otherDepartment}
                      onChange={(e) => setOtherDepartment(e.target.value)}
                      className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                    />
                  )}
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
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all text-slate-900"
                  >
                    <option value="K. K. Wagh Institute of Engineering Education & Research, Nashik">
                      K. K. Wagh Institute of Engineering Education &amp; Research, Nashik
                    </option>
                    <option value="KK Wagh Polytechnic, Nashik">
                      KK Wagh Polytechnic, Nashik
                    </option>
                    <option value="MVP Karmaveer Adv. Baburao Ganpatrao Thakare College of Engineering (KBTCOE), Nashik">
                      MVP Karmaveer Adv. Baburao Ganpatrao Thakare College of Engineering (KBTCOE), Nashik
                    </option>
                    <option value="Gokhale Education Society's R. H. Sapat College of Engineering, Management Studies and Research, Nashik">
                      Gokhale Education Society's R. H. Sapat College of Engineering, Management Studies and Research, Nashik
                    </option>
                    <option value="MET's Institute of Engineering, Nashik">
                      MET's Institute of Engineering, Nashik
                    </option>
                    <option value="Sandip Institute of Technology & Research Centre (SITRC), Nashik">
                      Sandip Institute of Technology &amp; Research Centre (SITRC), Nashik
                    </option>
                    <option value="Guru Gobind Singh College of Engineering and Research Centre, Nashik">
                      Guru Gobind Singh College of Engineering and Research Centre, Nashik
                    </option>
                    <option value="Matoshri College of Engineering and Research Centre, Nashik">
                      Matoshri College of Engineering and Research Centre, Nashik
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.college === "Other" && (
                    <input
                      type="text"
                      placeholder="Enter your college name"
                      value={otherCollege}
                      onChange={(e) => setOtherCollege(e.target.value)}
                      className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68F2] focus:border-transparent transition-all"
                    />
                  )}
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
