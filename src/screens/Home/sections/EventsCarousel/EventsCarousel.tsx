import React, { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface EventsCarouselProps {
  onOpenVisionWeekModal?: () => void;
}

export interface UpcomingEventItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  day: string;
  month: string;
  dateRange: string;
  location: string;
  image: string;
  isVisionWeek?: boolean;
  externalLink?: string;
}

export const staticUpcomingEvents: UpcomingEventItem[] = [
  {
    id: "vision-week-2026",
    title: "Vision Week 2026",
    subtitle: "Smarter Skills, Brighter Career • Explore • Create • Work Smarter",
    category: "FLAGSHIP",
    day: "26",
    month: "SEP",
    dateRange: "Sep 26 – 30, 2026",
    location: "Online Sessions",
    image: "/images/vision-week-cover.png",
    isVisionWeek: true,
  },
  {
    id: "expert-talk-2026",
    title: "Global IT Careers 2027+",
    subtitle: "Expert Session by Dr. Deepak Shikarpur",
    category: "EXPERT TALK",
    day: "8",
    month: "SEP",
    dateRange: "Sep 8, 2026",
    location: "JVN Hall, KKWIEER",
    image: "https://files.catbox.moe/smyr5w.jpg",
  },
  {
    id: "installation-2026",
    title: "CSI Installation Ceremony 2026",
    subtitle: "Official Committee Induction Ceremony 2026",
    category: "CEREMONY",
    day: "18",
    month: "AUG",
    dateRange: "Aug 18, 2026",
    location: "JVN Hall, KKWIEER",
    image: "https://files.catbox.moe/5yzddm.jpg",
  },
  {
    id: "eyantran-2026",
    title: "E-Yantran 2026",
    subtitle: "Largest E-Waste Awareness & Collection Mega Drive",
    category: "AWARENESS",
    day: "20",
    month: "JAN",
    dateRange: "Jan 20 – 23, 2026",
    location: "Campus Wide",
    image: "/images/Eyantran2026.jpeg",
  },
  {
    id: "campus-to-corporate-4",
    title: "Campus to Corporate 4.0",
    subtitle: "Career Readiness & Industry Transition",
    category: "BOOTCAMP",
    day: "28",
    month: "SEP",
    dateRange: "Sep 28, 2025",
    location: "Multiple Labs",
    image: "/images/c2c.png",
  },
];

export const EventsCarousel: React.FC<EventsCarouselProps> = ({
  onOpenVisionWeekModal,
}) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  const handleCardAction = (event: UpcomingEventItem) => {
    if (event.isVisionWeek) {
      router.push("/vision-week-register");
    } else if (event.externalLink) {
      window.open(event.externalLink, "_blank");
    } else {
      router.push("/events");
    }
  };

  return (
    <section id="events-section" className="w-full py-14 sm:py-16 bg-transparent border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
              Upcoming Events
            </h2>
            <div className="w-10 h-1 bg-[#1D68F2] rounded-full mt-1" />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D68F2] hover:text-blue-700 transition-colors group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Nav Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-[#1D68F2] hover:text-white hover:border-[#1D68F2] hover:scale-110 active:scale-95 flex items-center justify-center text-slate-700 transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
                aria-label="Previous events"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-[#1D68F2] hover:text-white hover:border-[#1D68F2] hover:scale-110 active:scale-95 flex items-center justify-center text-slate-700 transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
                aria-label="Next events"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Cards Row */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {staticUpcomingEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleCardAction(event)}
              className="group cursor-pointer flex-shrink-0 w-[300px] sm:w-[350px] lg:w-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-400/80 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between snap-start"
            >
              {/* Card Image with Badges */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Date Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 shadow-md text-center min-w-[48px] border border-white/50">
                  <div className="text-[10px] uppercase font-bold text-[#1D68F2] tracking-wider leading-none">
                    {event.month}
                  </div>
                  <div className="text-lg font-extrabold text-[#0A192F] leading-tight">
                    {event.day}
                  </div>
                </div>

                {/* Category Pill (Top Right) */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md border ${
                    event.isVisionWeek
                      ? "bg-blue-600 text-white border-blue-400 shadow-md animate-pulse"
                      : "bg-[#0A192F]/80 text-white border-white/20"
                  }`}>
                    {event.isVisionWeek && <Sparkles className="w-2.5 h-2.5 text-amber-300" />}
                    <span>{event.category}</span>
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0A192F] group-hover:text-[#1D68F2] transition-colors leading-snug mb-1.5">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {event.subtitle}
                  </p>
                </div>

                {/* Card Meta & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#1D68F2] flex-shrink-0" />
                      <span className="truncate max-w-[190px]">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{event.dateRange}</span>
                    </div>
                  </div>

                  {/* Circular Arrow Button / Register action */}
                  <div className="flex items-center">
                    {event.isVisionWeek ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-[#1D68F2] text-xs font-bold group-hover:bg-[#1D68F2] group-hover:text-white transition-all shadow-xs">
                        <span>Register</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <div className="w-9 h-9 rounded-full border border-slate-200 group-hover:border-[#1D68F2] group-hover:bg-[#1D68F2] text-slate-600 group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventsCarousel;