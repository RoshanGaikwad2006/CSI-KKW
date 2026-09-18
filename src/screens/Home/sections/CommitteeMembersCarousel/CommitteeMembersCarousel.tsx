"use client";
import React from "react";
import { useRouter } from "next/router";
import { CoverFlowCarousel, CarouselItem } from "../../../../components/ui/3-d-coverflow-carousel";
import { ArrowRight, Users } from "lucide-react";

// -------------------- Types --------------------
interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  year: string;
  image: string;
  linkedin?: string;
  description?: string;
}

// Position Order
const ALL_POSITIONS = [
  "President",
  "Vice-President",
  "Secretary",
  "Joint-Secretary",
  "Treasurer",
  "Joint-Treasurer",
];

// Local optimized committee images
const CLOUDINARY_BASE = "/images/2026";

// -------------------- Data (2026-27 Committee) --------------------
const committeeMembers: CommitteeMember[] = [
  {
    id: "1",
    name: "Kasturi Shinde",
    position: "President",
    year: "2026",
    image: `${CLOUDINARY_BASE}/1.Kasturi_Shinde.png`,
    linkedin: "https://www.linkedin.com/in/kasturi-shinde31/",
    description: "Leading the CSI KKWIEER Student Branch with strategic vision, leadership, and technical excellence.",
  },
  {
    id: "2",
    name: "Rehan Pinjari",
    position: "Vice-President",
    year: "2026",
    image: `${CLOUDINARY_BASE}/2.Rehan_Pinjari.png`,
    linkedin: "https://www.linkedin.com/in/rehan-pinjari/",
    description: "Directing student engagement, event operations, and inter-collegiate technological partnerships.",
  },
  {
    id: "3",
    name: "Sneha Shelar",
    position: "Secretary",
    year: "2026",
    image: `${CLOUDINARY_BASE}/3.Sneha_Shelar.png`,
    linkedin: "https://www.linkedin.com/in/sneha-shelar-1711ab318/",
    description: "Orchestrating chapter administration, official correspondence, and member documentation.",
  },
  {
    id: "4",
    name: "Rajas Mahajan",
    position: "Joint-Secretary",
    year: "2026",
    image: `${CLOUDINARY_BASE}/4.Rajas_Mahajan.png`,
    linkedin: "https://www.linkedin.com/in/rajas-mahajan-6563b72a7/",
    description: "Coordinating logistical operations, venue management, and cross-department workshops.",
  },
  {
    id: "5",
    name: "Bhumika Jadhav",
    position: "Treasurer",
    year: "2026",
    image: `${CLOUDINARY_BASE}/5.Bhumika_Jadhav.png`,
    linkedin: "https://www.linkedin.com/in/bhumika-jadhav-587203342",
    description: "Overseeing financial planning, corporate sponsorships, and annual budget allocations.",
  },
  {
    id: "6",
    name: "Soham Bagad",
    position: "Joint-Treasurer",
    year: "2026",
    image: `${CLOUDINARY_BASE}/6.Soham_Bagad.png`,
    linkedin: "https://www.linkedin.com/in/soham-bagad",
    description: "Managing resource disbursement, accounting records, and event sponsorship reconciliation.",
  },
];

export const CommitteeMembersCarousel: React.FC = () => {
  const router = useRouter();

  // Sort by defined positions & map to 3D Coverflow carousel items (memoized to keep reference stable)
  const coverFlowItems: CarouselItem[] = React.useMemo(() => {
    const sorted = [...committeeMembers].sort((a, b) => {
      const aIndex = ALL_POSITIONS.indexOf(a.position);
      const bIndex = ALL_POSITIONS.indexOf(b.position);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sorted.map((m) => ({
      tag: m.position.replace(/-/g, " "),
      titleLine1: m.name.toUpperCase(),
      titleLine2: `– ${m.position.toUpperCase().replace(/-/g, " ")}`,
      desc: m.description || `Core leadership member driving technical workshops and community excellence at CSI KKWIEER.`,
      img: m.image,
      ctaText: "LinkedIn Profile",
      ctaUrl: m.linkedin || "#",
      // President slide lingers for half the time of every other slide
      ...(m.position === "President" ? { delay: 1500 } : {}),
    }));
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Let's. Make. It. Happen
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Meet the passionate student leaders driving technical innovation, regional hackathons, and community growth at CSI KKWIEER.
          </p>
        </div>

        {/* 3D Coverflow Stage (Dedicated Primary View) */}
        <div className="w-full max-w-7xl mx-auto mb-10 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-[#0c0a09]/90">
          <CoverFlowCarousel
            items={coverFlowItems}
            sectionLabel="CSI KKWIEER CORE LEADERSHIP"
            accentColor="#1D68F2"
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={false}
          />
        </div>

        {/* View All Members Button */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <button
            onClick={() => router.push("/committee")}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1D68F2] hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>View All 26 Committee Members</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-slate-500">
            Explore coordinators across Technical, Media, Web, Public Relations, and Logistics teams
          </p>
        </div>

      </div>
    </section>
  );
};

export default CommitteeMembersCarousel;