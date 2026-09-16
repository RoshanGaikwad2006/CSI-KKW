import React from "react";
import { Check, Mail, Calendar, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { EventItem } from "@/data/eventsData";

interface RegistrationSuccessViewProps {
  event: EventItem;
  registrationData: {
    name: string;
    email: string;
    contactNumber?: string;
    department?: string;
    year?: string;
    ticketId?: string;
  };
  onBackToEvents: () => void;
  onPreviewEmail: () => void;
}

export const RegistrationSuccessView: React.FC<RegistrationSuccessViewProps> = ({
  event,
  registrationData,
  onBackToEvents,
  onPreviewEmail,
}) => {
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${event.title} - CSI KKWIEER`);
    const details = encodeURIComponent(
      `${event.description}\n\nVenue: ${event.venueFull || event.location}\nTicket ID: ${registrationData.ticketId}`
    );
    const location = encodeURIComponent(event.venueFull || event.location);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center text-center">
      
      {/* Decorative Background Confetti Spots */}
      <div className="absolute -top-6 left-12 w-3 h-3 rounded-full bg-blue-400 opacity-80 animate-ping" />
      <div className="absolute top-10 right-16 w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
      <div className="absolute top-24 left-8 w-2 h-2 rounded-full bg-emerald-400 opacity-80" />
      <div className="absolute top-32 right-10 w-3 h-3 rounded-full bg-purple-400 opacity-70" />
      <div className="absolute bottom-16 left-16 w-2.5 h-2.5 rounded-full bg-pink-400 opacity-80" />
      <div className="absolute bottom-10 right-20 w-3 h-3 rounded-full bg-blue-500 opacity-70" />

      {/* Big Green Success Circle */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 animate-in zoom-in-75 duration-300">
          <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
        </div>
        <span className="absolute -top-1 -right-1 text-amber-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight">
        Registration Successful!
      </h1>
      <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
        Thank you for registering for <strong className="text-slate-900">{event.title}</strong>. We're excited to see you there!
      </p>

      {/* Confirmation Notification Card */}
      <div className="w-full max-w-md bg-blue-50/70 border border-blue-100 rounded-2xl p-5 my-8 shadow-sm text-left flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100/90 text-[#1D68F2] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Mail className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="text-slate-800 font-medium leading-snug">
            A confirmation email has been sent to{" "}
            <span className="font-bold text-slate-900 break-all">{registrationData.email}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Check your inbox (and spam folder)
          </p>
          {registrationData.ticketId && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-blue-200 text-[11px] font-mono text-blue-700 font-bold">
              Ticket: {registrationData.ticketId}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <button
          onClick={onBackToEvents}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1D68F2] text-white font-semibold text-sm hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        <button
          onClick={handleAddToCalendar}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Add to Calendar</span>
        </button>
      </div>

      {/* Email Preview CTA */}
      <div className="mt-6">
        <button
          onClick={onPreviewEmail}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D68F2] hover:text-blue-700 hover:underline transition-colors"
        >
          <span>Preview Confirmation Email</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
