import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  Monitor,
} from "lucide-react";
import { Navbar } from "../../components/ui/navbar";
import { eventsData, EventItem } from "@/data/eventsData";
import { EventDetailView } from "./components/EventDetailView";
import { RegistrationSuccessView } from "./components/RegistrationSuccessView";
import { ConfirmationEmailModal } from "./components/ConfirmationEmailModal";
import { CaseStudyPresentation } from "./components/CaseStudyPresentation";

const CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "workshops", label: "Workshops" },
  { id: "talks", label: "Talks" },
  { id: "competitions", label: "Competitions" },
  { id: "community", label: "Community" },
];

export const Events = (): JSX.Element => {
  const router = useRouter();

  // Mode: "interactive" (default live flow) | "case-study" (multi-screen presentation)
  const [viewMode, setViewMode] = useState<"interactive" | "case-study">("interactive");
  
  // Interactive Flow States:
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [registrationSuccessData, setRegistrationSuccessData] = useState<any | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Check URL query parameters (e.g. /events?id=e-yantran-2026 or ?view=case-study)
  useEffect(() => {
    if (router.query.view === "case-study") {
      setViewMode("case-study");
    }
    if (router.query.id && typeof router.query.id === "string") {
      setSelectedEventId(router.query.id);
    }
  }, [router.query]);

  // Selected event object
  const selectedEvent = eventsData.find((e) => e.id === selectedEventId) || null;

  // Filtered events
  const filteredEvents = eventsData.filter((event) => {
    const matchesCategory =
      activeCategory === "all" ||
      event.category === activeCategory ||
      (activeCategory === "competitions" && event.category === "hackathons");

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.subtitle && event.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setRegistrationSuccessData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setRegistrationSuccessData(null);
  };

  return (
    <div className="min-h-screen w-full bg-white font-['Inter',sans-serif] text-slate-900 flex flex-col items-center overflow-x-clip">
      
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Mode Switcher Bar (Interactive Live vs Case Study Showcase) */}
      <div className="w-full bg-slate-50 border-b border-slate-200/90 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">CSI KKWIEER Event Platform</span>
            <span className="text-slate-400 hidden sm:inline">• Production-Ready UI/UX System</span>
          </div>

          {/* Toggle Pills */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/60">
            <button
              onClick={() => {
                setViewMode("interactive");
                router.replace("/events", undefined, { shallow: true });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold text-xs transition-all ${
                viewMode === "interactive"
                  ? "bg-white text-[#1D68F2] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Live Interactive Flow</span>
            </button>

            <button
              onClick={() => {
                setViewMode("case-study");
                router.replace("/events?view=case-study", undefined, { shallow: true });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold text-xs transition-all ${
                viewMode === "case-study"
                  ? "bg-[#1D68F2] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Screen UI/UX Case Study</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: MULTI-SCREEN UI/UX CASE STUDY PRESENTATION        */}
      {/* ========================================================= */}
      {viewMode === "case-study" && (
        <CaseStudyPresentation
          onSelectEventForLive={(id) => {
            setViewMode("interactive");
            handleSelectEvent(id);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* VIEW 2: LIVE INTERACTIVE FLOW (SCREEN 1, 2, 3)            */}
      {/* ========================================================= */}
      {viewMode === "interactive" && (
        <main className="w-full flex-1">
          
          {/* STATE A: Detailed Event View or Registration Success */}
          {selectedEvent ? (
            <div className="w-full">
              {registrationSuccessData ? (
                /* SCREEN 3: Registration Success */
                <RegistrationSuccessView
                  event={selectedEvent}
                  registrationData={registrationSuccessData}
                  onBackToEvents={handleBackToEvents}
                  onPreviewEmail={() => setIsEmailModalOpen(true)}
                />
              ) : (
                /* SCREEN 2: Event Details + Sticky Registration Form */
                <EventDetailView
                  event={selectedEvent}
                  onBack={handleBackToEvents}
                  onRegistrationComplete={(regData) => {
                    setRegistrationSuccessData(regData);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          ) : (
            /* STATE B: SCREEN 1 — Upcoming Events Discovery Page */
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              
              {/* Top Header Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-0.5 bg-[#1D68F2]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1D68F2]">
                      Calendar of Activities
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
                    Upcoming Events
                  </h1>
                  <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                    Be a part of our events, workshops, hackathons and technical sessions. Learn, build and grow together.
                  </p>
                </div>

                {/* Right Controls: Search & Category Dropdown */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#1D68F2] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Dropdown Indicator */}
                  <div className="relative">
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#1D68F2]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Category Filter Pills Row (Exact reference layout) */}
              <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-[#1D68F2] text-white shadow-sm shadow-blue-500/20"
                          : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Event Cards Grid (2 rows x 3 cols = 6 cards matching reference) */}
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleSelectEvent(event.id as string)}
                      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Event Image Banner with Overlays */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10" />

                          {/* Top-Left Date Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 px-3 text-center shadow-md border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                              {event.dateBadge.month}
                            </div>
                            <div className="text-lg font-black text-[#0A192F] leading-none my-0.5">
                              {event.dateBadge.day}
                            </div>
                            {event.dateBadge.year && (
                              <div className="text-[9px] font-semibold text-slate-400 leading-none">
                                {event.dateBadge.year}
                              </div>
                            )}
                          </div>

                          {/* Top-Right Category Pill */}
                          <div className="absolute top-3 right-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                              {event.categoryBadge}
                            </span>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-5 sm:p-6">
                          <h3 className="text-lg font-bold text-[#0A192F] group-hover:text-[#1D68F2] transition-colors line-clamp-1">
                            {event.title}
                          </h3>
                          {event.subtitle && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                              {event.subtitle}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed mt-2.5 line-clamp-2">
                            {event.description}
                          </p>

                          {/* Event Details: Time, Location, Attendees */}
                          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-[#1D68F2] flex-shrink-0" />
                                <span className="font-medium">{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#1D68F2] flex-shrink-0" />
                              <span className="font-medium truncate">{event.location}</span>
                            </div>
                            {event.attendees && (
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-[#1D68F2] flex-shrink-0" />
                                <span className="font-medium">{event.attendees} Attendees</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Meta Footer */}
                      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div>
                          {event.registrationClosed ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Registrations Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1D68F2] border border-blue-200/60">
                              Open for Registration
                            </span>
                          )}
                        </div>

                        {/* Circle Blue Arrow Button */}
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1D68F2] group-hover:bg-[#1D68F2] group-hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200/80 mt-4">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No events found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your search query or selecting a different category filter.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#1D68F2] hover:bg-slate-50"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* Confirmation Email Preview Modal (Screen 4) */}
      {selectedEvent && (
        <ConfirmationEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          event={selectedEvent}
          registrationData={registrationSuccessData}
        />
      )}

    </div>
  );
};

export default Events;