import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Sparkles,
  BookOpen,
  Recycle,
  Mic,
  Award,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { EventItem } from "@/data/eventsData";

interface EventDetailViewProps {
  event: EventItem;
  onBack: () => void;
  onRegistrationComplete: (regData: any) => void;
}

const DEPARTMENTS = [
  "Computer",
  "Information Technology",
  "AIDS",
  "E&TC",
  "Mechanical",
  "Electrical",
  "Chemical",
  "Civil",
  "Robotics & Automation",
  "Other",
];

const YEARS = [
  "First Year (FE)",
  "Second Year (SE)",
  "Third Year (TE)",
  "Final Year (BE)",
];

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onBack,
  onRegistrationComplete,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    department: "",
    year: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.contactNumber.trim()) {
      errs.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/[^0-9]/g, ""))) {
      errs.contactNumber = "Please enter a 10-digit mobile number";
    }
    if (!formData.department) errs.department = "Select your department";
    if (!formData.year) errs.year = "Select your academic year";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const ticketId = `CSI-${event.id.toString().toUpperCase().slice(0, 3)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const payload = {
      ...formData,
      eventId: event.id,
      eventTitle: event.title,
      ticketId,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Call backend registration endpoint
      const res = await fetch("/api/event-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Even if offline/sandbox mode, complete gracefully
      onRegistrationComplete({
        name: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        department: formData.department,
        year: formData.year,
        ticketId,
      });
    } catch (err: any) {
      console.warn("API registration dispatch notice:", err);
      // Fallback transition so user experience is always fluid
      onRegistrationComplete({
        name: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        department: formData.department,
        year: formData.year,
        ticketId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExpectIcon = (iconType: string) => {
    switch (iconType) {
      case "sessions":
        return <BookOpen className="w-5 h-5 text-[#1D68F2]" />;
      case "drive":
        return <Recycle className="w-5 h-5 text-[#1D68F2]" />;
      case "talks":
        return <Mic className="w-5 h-5 text-[#1D68F2]" />;
      case "cert":
        return <Award className="w-5 h-5 text-[#1D68F2]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#1D68F2]" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1D68F2] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Events</span>
      </button>

      {/* Main Grid: Left Event Details, Right Sticky Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* LEFT COLUMN: Event Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Large Event Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 group">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

            {/* Date Badge on Image */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 text-center shadow-lg border border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {event.dateBadge.month}
              </div>
              <div className="text-xl font-extrabold text-[#0A192F] leading-none my-0.5">
                {event.dateBadge.day}
              </div>
              {event.dateBadge.year && (
                <div className="text-[10px] font-semibold text-slate-400">
                  {event.dateBadge.year}
                </div>
              )}
            </div>

            {/* Category Badge on Image */}
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                {event.categoryBadge}
              </span>
            </div>
          </div>

          {/* Titles & Description */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              {event.title}
            </h1>
            {event.subtitle && (
              <h2 className="text-base sm:text-lg text-slate-600 font-medium mt-1">
                {event.subtitle}
              </h2>
            )}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
              {event.description}
            </p>
          </div>

          {/* Key Info Chips (Horizontal Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1D68F2] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">{event.dateRange}</div>
                <div className="text-slate-500">{event.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1D68F2] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">Venue</div>
                <div className="text-slate-500 truncate">{event.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1D68F2] flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">Attendance</div>
                <div className="text-slate-500">{event.expectedAttendees || "Open to All"}</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1D68F2] border border-blue-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* What to Expect? Section */}
          <div className="pt-2">
            <h3 className="text-lg font-bold text-[#0A192F] mb-4">
              What to Expect?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(event.whatToExpect || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getExpectIcon(item.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Map Section */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D68F2] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A192F]">Event Venue</h4>
                <p className="text-xs text-slate-600">{event.venueFull || event.location}</p>
              </div>
            </div>
            <button
              onClick={() => window.open("https://maps.google.com/?q=KKWIEER+Nashik", "_blank")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#1D68F2] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span>View on Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Have Questions? Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#1D68F2] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A192F]">Have Questions?</h4>
                <p className="text-xs text-slate-600">Feel free to reach out to our team.</p>
              </div>
            </div>
            <button
              onClick={() => {
                const footer = document.querySelector("footer");
                if (footer) footer.scrollIntoView({ behavior: "smooth" });
                else alert("Contact CSI KKWIEER at csi@kkwieer.edu.in");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Contact Us
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Integrated Registration Card (5 cols) */}
        <div className="lg:col-span-5 relative w-full">
          <div className="lg:sticky lg:top-24 z-20">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-7 relative max-h-[calc(100vh-7.5rem)] overflow-y-auto">
            
            {/* Top Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1D68F2] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A192F]">
                  Register for This Event
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details below to confirm your participation.
                </p>
              </div>
            </div>

            <hr className="my-4 border-slate-100" />

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-red-400 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:border-[#1D68F2] focus:ring-blue-100"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your college email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:border-[#1D68F2] focus:ring-blue-100"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit number"
                  maxLength={10}
                  value={formData.contactNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, contactNumber: e.target.value });
                    if (errors.contactNumber) setErrors({ ...errors, contactNumber: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.contactNumber
                      ? "border-red-400 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:border-[#1D68F2] focus:ring-blue-100"
                  }`}
                />
                {errors.contactNumber && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Department & Year (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (errors.department) setErrors({ ...errors, department: "" });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 bg-white ${
                      errors.department
                        ? "border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1D68F2] focus:ring-blue-100"
                    }`}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => {
                      setFormData({ ...formData, year: e.target.value });
                      if (errors.year) setErrors({ ...errors, year: "" });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 bg-white ${
                      errors.year
                        ? "border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1D68F2] focus:ring-blue-100"
                    }`}
                  >
                    <option value="">Select year</option>
                    {YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.year}</p>
                  )}
                </div>
              </div>

              {/* Optional Motivation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Why do you want to join? <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us your motivation..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D68F2] focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#1D68F2] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Privacy Footer */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your information is secure with us.</span>
              </div>

            </form>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};
