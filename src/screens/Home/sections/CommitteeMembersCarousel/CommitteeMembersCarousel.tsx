"use client";
import React from "react";
import { useRouter } from "next/router";
import { CoverFlowCarousel, CarouselItem } from "../../../../components/ui/3-d-coverflow-carousel";
import { ArrowRight, Users, Sparkles } from "lucide-react";

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
  "Joint Treasurer",
];

// -------------------- Data --------------------
const committeeMembers: CommitteeMember[] = [
  {
    id: "1",
    name: "Ankit Khandelwal",
    position: "President",
    year: "2025",
    image: "/images/2025/1Ankit.png",
    linkedin:
      "https://www.linkedin.com/in/ankit-khandelwal-002474295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    description: "Leading the CSI KKWIEER Student Branch with strategic vision, leadership, and technical excellence.",
  },
  {
    id: "2",
    name: "Manasi Jadhav",
    position: "Vice-President",
    year: "2025",
    image: "/images/2025/2Manasi.png",
    linkedin: "https://www.linkedin.com/in/manasi-jadhav-3ba44228b/",
    description: "Directing student engagement, event operations, and inter-collegiate technological partnerships.",
  },
  {
    id: "3",
    name: "Shweta Yeola",
    position: "Secretary",
    year: "2025",
    image: "/images/2025/3Shweta.png",
    linkedin: "https://www.linkedin.com/in/shweta-yeola-3a8075296/",
    description: "Orchestrating chapter administration, official correspondence, and member documentation.",
  },
  {
    id: "4",
    name: "Meghraj Bhavsar",
    position: "Joint-Secretary",
    year: "2025",
    image: "/images/2025/4Meghraj.png",
    linkedin:
      "https://www.linkedin.com/in/meghraj-bhavsar-3449ba289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    description: "Coordinating logistical operations, venue management, and cross-department workshops.",
  },
  {
    id: "5",
    name: "Atharva Jadhav",
    position: "Treasurer",
    year: "2025",
    image: "/images/2025/5Atharva.png",
    linkedin:
      "https://www.linkedin.com/in/atharva-jadhav-73a997295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    description: "Overseeing financial planning, corporate sponsorships, and annual budget allocations.",
  },
  {
    id: "6",
    name: "Sadique Khatib",
    position: "Joint Treasurer",
    year: "2025",
    image: "/images/2025/6Sadique.png",
    linkedin:
      "https://www.linkedin.com/in/sadique-khatib-4175342a9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    description: "Managing resource disbursement, accounting records, and event sponsorship reconciliation.",
  },
];

export const CommitteeMembersCarousel: React.FC = () => {
  const router = useRouter();

  // Sort by defined positions
  const sortedMembers = [...committeeMembers].sort((a, b) => {
    const aIndex = ALL_POSITIONS.indexOf(a.position);
    const bIndex = ALL_POSITIONS.indexOf(b.position);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Map committee members to 3D Coverflow carousel items
  const coverFlowItems: CarouselItem[] = sortedMembers.map((m) => ({
    tag: `#${m.position.replace(/\s+/g, "")}`,
    titleLine1: m.name.toUpperCase(),
    titleLine2: `– ${m.position.toUpperCase()}`,
    desc: m.description || `Core leadership member driving technical workshops and community excellence at CSI KKWIEER.`,
    img: m.image,
    ctaText: "LinkedIn Profile",
    ctaUrl: m.linkedin || "#",
  }));

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Core Executive Board 2025-26</span>
          </div>

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
            autoplayDelay={3500}
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