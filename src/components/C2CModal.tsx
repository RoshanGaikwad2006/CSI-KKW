import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
  QrCode,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";

interface C2CModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const C2CModal: React.FC<C2CModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    year: "Third Year (TE)",
    upiId: "",
    comments: "",
  });

  const [otherDepartment, setOtherDepartment] = useState("");
  const [otherYear, setOtherYear] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
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
      setError("Please fill in all required fields (Name, Email, WhatsApp Phone).");
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

    if (!formData.upiId.trim()) {
      setError("Please enter your UPI ID or Transaction ID (UTR).");
      setLoading(false);
      return;
    }

    try {
      const finalYear =
        formData.year === "Other"
          ? otherYear.trim() || "Other"
          : formData.year;

      const finalDepartment =
        formData.department === "Other"
          ? otherDepartment.trim() || "Other"
          : formData.department;

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: "K. K. Wagh Institute of Engineering Education & Research, Nashik",
        department: finalDepartment,
        year: finalYear,
        upiId: formData.upiId.trim(),
        comments: formData.comments.trim(),
      };

      const res = await fetch("/api/c2c-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketId(data.ticketId || null);
        setSubmitted(true);
      } else {
        setError(data.error || data.message || "Failed to record registration.");
      }
    } catch (err: any) {
      console.error("C2C Modal registration error:", err);
      setError("Network connection issue. Please verify connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setTicketId(null);
    setError(null);
    setOtherDepartment("");
    setOtherYear("");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      year: "Third Year (TE)",
      upiId: "",
      comments: "",
    });
  };

  const finalYearDisplay =
    formData.year === "Other" ? otherYear || "Other" : formData.year;
  const finalDeptDisplay =
    formData.department === "Other" ? otherDepartment || "Other" : formData.department;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#0A192F] via-[#0F2748] to-[#0A192F] text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase border border-blue-400/20">
              CAMPUS TO CORPORATE 5.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-400/20">
              FEE: ₹50
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            From Campus to Corporate 5.0
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Registration Form • Round 1: Apti &amp; Coding (DSA) • Round 2: GD • Round 3: Technical + HR
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-900 font-sans">
          {submitted ? (
            /* SUCCESS VIEW */
            <div className="py-4 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-1 font-display">
                REGISTRATION CONFIRMED
              </h3>
              <p className="text-xs font-mono font-bold text-[#1D68F2] mb-3">
                PASS ID: {ticketId || "C2C5-CONFIRMED"}
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-5 leading-relaxed font-sans">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your seat for{" "}
                <strong>From Campus to Corporate 5.0</strong> has been recorded.
              </p>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-700 space-y-2 mb-5">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">NAME</span>
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">INSTITUTE</span>
                  <span className="font-bold text-slate-900">KKWIEER, Nashik</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">DEPARTMENT</span>
                  <span className="font-bold text-slate-900">{finalDeptDisplay}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">ACADEMIC YEAR</span>
                  <span className="font-bold text-slate-900">{finalYearDisplay}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">UPI ID / UTR</span>
                  <span className="font-bold text-slate-900">{formData.upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">STATUS</span>
                  <span className="font-bold text-emerald-700">CONFIRMED ✓</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <a
                  href="https://chat.whatsapp.com/IOXB6jA3vtV7Bx0IY10KTb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Join Official C2C WhatsApp Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Done &amp; Close
                </Button>
              </div>

              <button
                onClick={resetForm}
                className="text-xs text-[#1D68F2] hover:underline font-bold mt-4"
              >
                Register another candidate
              </button>
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Fixed College Tag */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center gap-2 text-xs text-[#0A192F]">
                <Building2 className="w-4 h-4 text-[#1D68F2] shrink-0" />
                <span className="font-medium text-slate-700">
                  Institute: <strong className="text-[#0A192F]">KKWIEER, Nashik</strong>
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                  FULL NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="First Last"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] text-slate-900"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                    EMAIL ADDRESS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@kkwagh.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                    WHATSAPP PHONE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] text-slate-900"
                  />
                </div>
              </div>

              {/* Department & Academic Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                    DEPARTMENT <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] text-slate-900"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer">Computer</option>
                    <option value="Information Technology">IT</option>
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
                      placeholder="Specify your department"
                      value={otherDepartment}
                      onChange={(e) => setOtherDepartment(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                    ACADEMIC YEAR <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs focus:ring-2 focus:ring-[#1D68F2]/30 focus:border-[#1D68F2] text-slate-900"
                  >
                    <option value="First Year (FE)">First Year (FE)</option>
                    <option value="Second Year (SE)">Second Year (SE)</option>
                    <option value="Third Year (TE)">Third Year (TE)</option>
                    <option value="Final Year (BE)">Final Year (BE)</option>
                    <option value="Other">Other (Specify)</option>
                  </select>
                  {formData.year === "Other" && (
                    <input
                      type="text"
                      placeholder="Specify year / course (e.g. MCA, ME)"
                      value={otherYear}
                      onChange={(e) => setOtherYear(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900"
                    />
                  )}
                </div>
              </div>

              {/* UPI ID / UTR & Payment Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">
                    PAYMENT (₹50 ENTRY FEE)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    SCAN QR VIA PHONEPE / GPAY
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    UPI ID / TRANSACTION ID (UTR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    required
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="Enter 12-digit UTR or UPI reference ID"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1D68F2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Submit C2C 5.0 Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default C2CModal;
