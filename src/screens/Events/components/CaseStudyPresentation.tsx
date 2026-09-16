import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Check,
  Mail,
  Smartphone,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  ChevronDown,
  Menu,
  Star,
  Reply,
  MoreVertical,
} from "lucide-react";
import { eventsData } from "@/data/eventsData";

interface CaseStudyPresentationProps {
  onSelectEventForLive: (eventId: string) => void;
}

export const CaseStudyPresentation: React.FC<CaseStudyPresentationProps> = ({
  onSelectEventForLive,
}) => {
  const [activeTab, setActiveTab] = useState<"desktop-flow" | "mobile-view">("desktop-flow");
  const eyantran = eventsData[0];

  return (
    <div className="w-full bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Presentation Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Fidelity UI/UX Design System Case Study</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CSI KKWIEER Event Registration Journey
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A cohesive end-to-end UX flow engineered from event discovery to post-registration confirmation, maintaining 100% brand consistency, accessibility, and high conversion.
          </p>

          {/* Visual Flow Indicator */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-400">
              1. Event Discovery
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-400">
              2. Event Details &amp; Form
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
              3. Registration Success
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-purple-400">
              4. Confirmation Email
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">
              5. Mobile Experience
            </span>
          </div>
        </div>

        {/* =================================================== */}
        {/* ROW 1: SCREEN 1 (Discovery) -> SCREEN 2 (Details) */}
        {/* =================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
          
          {/* SCREEN 1: Events Page Mockup (6 cols) */}
          <div className="xl:col-span-6 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Screen 1: Upcoming Events Discovery
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                Desktop Layout
              </span>
            </div>

            {/* Inner Simulated White Browser Canvas */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 overflow-hidden shadow-inner text-left">
              {/* Mini Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <img src="/images/csi.png" alt="CSI" className="h-5 object-contain" />
                  <span className="font-black text-[#0A192F]">CSI KKWIEER</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-600">
                  <span>Home</span>
                  <span>About</span>
                  <span className="text-blue-600 font-bold border-b-2 border-blue-600">Events</span>
                  <span>Gallery</span>
                  <span>Team</span>
                </div>
                <button className="px-2.5 py-1 rounded-full bg-[#1D68F2] text-white text-[10px] font-bold">
                  Join CSI →
                </button>
              </div>

              {/* Title & Filter Bar */}
              <div className="mt-4 mb-3">
                <h3 className="text-lg font-black text-[#0A192F]">Upcoming Events</h3>
                <p className="text-[11px] text-slate-500">
                  Be a part of our events, workshops, hackathons and technical sessions.
                </p>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2.5 py-1 text-[11px] text-slate-500 flex-1 max-w-[180px]">
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>Search events...</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] bg-slate-100 rounded-lg px-2 py-1 text-slate-600 font-medium">
                    <span>All Events</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                  <span className="px-2.5 py-1 rounded-full bg-[#1D68F2] text-white font-bold whitespace-nowrap">
                    All Events
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                    Workshops
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                    Talks
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                    Hackathons
                  </span>
                </div>
              </div>

              {/* 4 Mini Cards Grid */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {eventsData.slice(0, 4).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEventForLive(evt.id as string)}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 mb-2">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 bg-white/95 rounded px-1.5 py-0.5 text-[9px] font-extrabold text-slate-900 leading-none">
                        {evt.dateBadge.month} {evt.dateBadge.day}
                      </span>
                      <span className="absolute top-1 right-1 bg-slate-900/80 text-white rounded px-1.5 py-0.5 text-[8px] font-bold">
                        {evt.categoryBadge}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#0A192F] truncate group-hover:text-[#1D68F2]">
                      {evt.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {evt.subtitle || evt.location}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[9px] text-slate-500">
                      <span>{evt.location}</span>
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="hidden xl:flex absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#1D68F2] text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-wider">
              Click Card
            </span>
          </div>

          {/* SCREEN 2: Event Details + Integrated Form Mockup (6 cols) */}
          <div className="xl:col-span-6 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Screen 2: Details &amp; Sticky Registration Form
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                Integrated Form
              </span>
            </div>

            {/* Inner Simulated White Canvas */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 overflow-hidden shadow-inner text-left">
              <div className="text-[11px] text-slate-500 font-semibold mb-2">
                ← Back to Events
              </div>
              
              <div className="grid grid-cols-12 gap-3 items-start">
                {/* Left Mini Details (7 cols) */}
                <div className="col-span-7 space-y-2">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-800">
                    <img src={eyantran.image} alt={eyantran.title} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 bg-white rounded px-2 py-0.5 text-[9px] font-black text-slate-900">
                      JAN 24 2026
                    </span>
                    <span className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white rounded px-1.5 py-0.5 text-[8px] font-bold">
                      AWARENESS
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#0A192F]">{eyantran.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{eyantran.subtitle}</p>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{eyantran.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[9px]">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Jan 24 - Feb 15</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">KKWIEER Campus</span>
                  </div>
                  {/* What to expect miniature */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9px]">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800 block">Awareness</span>
                      <span className="text-slate-500">Learn e-waste impact</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800 block">Collection Drive</span>
                      <span className="text-slate-500">Campus drop points</span>
                    </div>
                  </div>
                </div>

                {/* Right Mini Sticky Registration Card (5 cols) */}
                <div className="col-span-5 bg-slate-50 rounded-xl p-3 border border-slate-200/90 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#1D68F2] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 leading-tight">
                      Register for This Event
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[9px]">
                    <div>
                      <span className="text-slate-600 block">Full Name *</span>
                      <div className="h-6 rounded border border-slate-300 bg-white px-1.5 flex items-center text-slate-400">
                        Roshan Gaikwad
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Email Address *</span>
                      <div className="h-6 rounded border border-slate-300 bg-white px-1.5 flex items-center text-slate-400">
                        roshan@example.com
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-slate-600 block">Department *</span>
                        <div className="h-6 rounded border border-slate-300 bg-white px-1 flex items-center text-slate-500 text-[8px]">
                          Computer
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600 block">Year *</span>
                        <div className="h-6 rounded border border-slate-300 bg-white px-1 flex items-center text-slate-500 text-[8px]">
                          Third (TE)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectEventForLive("e-yantran-2026")}
                      className="w-full py-1.5 rounded-lg bg-[#1D68F2] text-white font-bold text-[10px] hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      Register Now →
                    </button>
                    <div className="text-[8px] text-slate-400 text-center">
                      🔒 Your information is secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* =================================================== */}
        {/* ROW 2: SCREEN 3 (Success) -> SCREEN 4 (Email) -> SCREEN 5 (Mobile) */}
        {/* =================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 items-start">
          
          {/* SCREEN 3: Registration Success (4 cols) */}
          <div className="xl:col-span-4 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Screen 3: Registration Success
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Confirmed State
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 text-slate-900 text-center space-y-4 shadow-inner">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#0A192F]">
                  Registration Successful!
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thank you for registering for E-Yantran 2026. We're excited to see you there!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-left flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-[10px]">
                  <p className="text-slate-800 font-semibold">
                    A confirmation email has been sent to roshan@example.com
                  </p>
                  <p className="text-slate-400">Check your inbox (and spam folder)</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px]">
                <span className="px-3 py-1.5 rounded-lg bg-[#1D68F2] text-white font-semibold">
                  Back to Events
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold">
                  Add to Calendar
                </span>
              </div>
            </div>
          </div>

          {/* SCREEN 4: Confirmation Email Preview (4 cols) */}
          <div className="xl:col-span-4 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Screen 4: Confirmation Email
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Email Client
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner text-slate-900 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-blue-600" />
                  <span className="font-bold">Event Registration Confirmation</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[9px] font-bold uppercase">
                  Inbox
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px]">
                    CSI
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">CSI KKWIEER</div>
                    <div className="text-slate-400 text-[9px]">to roshan@example.com</div>
                  </div>
                </div>

                <div className="pt-1 text-slate-700">
                  <p className="font-bold text-slate-900">Hi Roshan,</p>
                  <p className="mt-0.5">Thank you for registering for <strong>E-Yantran 2026</strong>!</p>
                </div>

                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[9px] space-y-1">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span>Jan 24 – Feb 15, 2026</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>KKWIEER Campus, Nashik</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>10:00 AM – 5:00 PM</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-500">
                  We're excited to have you with us. See you there!
                  <br />
                  <strong className="text-slate-700">Team CSI KKWIEER</strong>
                </p>
              </div>
            </div>
          </div>

          {/* SCREEN 5: Mobile Responsive Mockup (4 cols) */}
          <div className="xl:col-span-4 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Screen 5: Mobile View (Responsive)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                iPhone / Android
              </span>
            </div>

            {/* Mobile Phone Mockup Device Frame */}
            <div className="w-full max-w-[280px] bg-slate-900 rounded-[36px] p-3 border-4 border-slate-700 shadow-2xl">
              <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-2" />

              <div className="bg-white rounded-[26px] p-3 text-slate-900 text-left overflow-hidden space-y-3">
                {/* Mobile Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <img src="/images/csi.png" alt="CSI" className="h-4 object-contain" />
                    <span className="font-extrabold text-[11px] text-[#0A192F]">CSI</span>
                  </div>
                  <Menu className="w-4 h-4 text-slate-700" />
                </div>

                {/* Mobile Mini Event Card */}
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="relative aspect-[16/10] bg-slate-800">
                    <img src={eyantran.image} alt="Mobile" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-white rounded px-1.5 py-0.5 text-[8px] font-black">
                      JAN 24
                    </span>
                    <span className="absolute top-1 right-1 bg-slate-900/80 text-white rounded px-1.5 py-0.5 text-[7px] font-bold">
                      AWARENESS
                    </span>
                  </div>
                  <div className="p-2">
                    <div className="font-bold text-[11px] text-slate-900">E-Yantran 2026</div>
                    <div className="text-[9px] text-slate-500 truncate">KKWIEER Campus</div>
                  </div>
                </div>

                {/* Mobile Registration Form Card */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-slate-900">
                    ← Register for This Event
                  </div>
                  <div className="space-y-1.5 text-[8px]">
                    <div className="h-5 rounded border border-slate-300 bg-white px-1.5 flex items-center text-slate-400">
                      Full Name *
                    </div>
                    <div className="h-5 rounded border border-slate-300 bg-white px-1.5 flex items-center text-slate-400">
                      College Email *
                    </div>
                    <div className="h-5 rounded border border-slate-300 bg-white px-1.5 flex items-center text-slate-400">
                      Department
                    </div>
                    <button
                      onClick={() => onSelectEventForLive("e-yantran-2026")}
                      className="w-full py-1.5 rounded-lg bg-[#1D68F2] text-white font-bold text-[9px]"
                    >
                      Register Now →
                    </button>
                  </div>
                </div>

              </div>
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>

        </div>

        {/* Presentation CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">
              Ready to Experience the Live Event Flow?
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Switch to Live Interactive Mode to test real registrations, form validations, and email triggers.
            </p>
          </div>
          <button
            onClick={() => onSelectEventForLive("e-yantran-2026")}
            className="px-6 py-3 rounded-xl bg-[#1D68F2] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Launch Live Interactive Flow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
