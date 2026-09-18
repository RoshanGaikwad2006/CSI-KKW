import React, { useEffect } from "react";
import { X, Mail, Calendar, MapPin, Clock, CheckCircle2, Share2, Star, Reply, MoreVertical } from "lucide-react";
import { EventItem } from "@/data/eventsData";

interface ConfirmationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  registrationData?: {
    name: string;
    email: string;
    contactNumber?: string;
    department?: string;
    year?: string;
    ticketId?: string;
  };
}

export const ConfirmationEmailModal: React.FC<ConfirmationEmailModalProps> = ({
  isOpen,
  onClose,
  event,
  registrationData,
}) => {
  // Lock body scroll when modal is open and restore on close/unmount
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

  const participantName = registrationData?.name || "Student";
  const participantEmail = registrationData?.email || "student@example.com";
  const ticketId = registrationData?.ticketId || "CSI-EVT-9428";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Email Client Window Bar */}
        <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="flex items-center gap-2 ml-3 text-xs font-semibold text-slate-600">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Event Registration Confirmation</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-600 uppercase font-bold">
                Inbox
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Metadata Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                CSI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">CSI KKWIEER</span>
                  <span className="text-xs text-slate-400">&lt;noreply@csi-kkwieer.in&gt;</span>
                </div>
                <div className="text-xs text-slate-500">
                  to <span className="font-medium text-slate-700">{participantEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Star className="w-4 h-4 hover:text-amber-500 cursor-pointer transition-colors" />
              <Reply className="w-4 h-4 hover:text-slate-700 cursor-pointer transition-colors ml-2" />
              <MoreVertical className="w-4 h-4 hover:text-slate-700 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
          
          {/* Branded CSI Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="flex justify-center items-center gap-3 mb-1">
              <img src="/images/csi.png" alt="CSI Logo" className="h-9 object-contain" />
              <div className="text-left">
                <div className="font-black text-[#0A192F] text-base leading-tight">CSI KKWIEER</div>
                <div className="text-[9px] uppercase tracking-wider font-bold text-blue-600">
                  Student Community For a Better Tomorrow
                </div>
              </div>
            </div>
          </div>

          {/* Salutation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hi {participantName},
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Thank you for registering for <strong className="text-slate-900">{event.title}</strong>! Your registration is officially confirmed.
              </p>
            </div>

            {/* Event Specific Card */}
            <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Registration Ticket
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                  {ticketId}
                </span>
              </div>

              <div className="text-base font-bold text-[#0A192F]">
                {event.title}
                {event.subtitle && <span className="block text-xs font-normal text-slate-500">{event.subtitle}</span>}
              </div>

              <div className="pt-2 border-t border-blue-100/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span><strong>Date:</strong> {event.dateRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span><strong>Time:</strong> {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span><strong>Venue:</strong> {event.venueFull || event.location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Please present this confirmation email or your ticket ID at the check-in desk upon arrival.
              We look forward to an exciting session of learning, building, and innovation together!
            </p>

            {/* CTA Buttons in Email */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  alert("Event added to Google Calendar!");
                }}
                className="px-4 py-2 rounded-xl bg-[#1D68F2] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm"
              >
                Add to Calendar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                View Event Details
              </button>
            </div>
          </div>

          {/* Email Footer */}
          <div className="text-center text-xs text-slate-400 pt-2 pb-1">
            <p className="font-semibold text-slate-600">Computer Society of India — KKWIEER Students' Branch</p>
            <p className="text-[11px] mt-0.5">K. K. Wagh Institute of Engineering Education and Research, Nashik, MH</p>
            <p className="text-[10px] text-slate-400 mt-2">© 2026 CSI KKWIEER. All rights reserved.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
