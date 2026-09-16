import React from "react";
import { CoverFlowCarousel, defaultCsiCommitteeItems } from "@/components/ui/3-d-coverflow-carousel";
import { Navbar } from "@/components/ui/navbar";

export default function Demo() {
  return (
    <div className="w-full min-h-screen bg-[#0c0a09] flex flex-col items-center justify-start">
      <Navbar />
      <div className="w-full max-w-7xl px-4 pt-12 pb-4 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
          CSI Committee Leadership Animation
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          3D Coverflow Experience
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Interactive 3D Coverflow carousel featuring the core board leadership of CSI KKWIEER Student Branch.
        </p>
      </div>
      <div className="w-full">
        <CoverFlowCarousel
          items={defaultCsiCommitteeItems}
          sectionLabel="CSI KKWIEER BOARD 2025-26"
          accentColor="#1D68F2"
          autoplay={true}
          autoplayDelay={4000}
        />
      </div>
    </div>
  );
}
