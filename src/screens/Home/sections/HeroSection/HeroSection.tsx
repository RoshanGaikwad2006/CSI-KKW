import React from "react";
import { ArrowRight, Users, Calendar, Trophy, Sparkles } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface HeroSectionProps {
  onExploreEvents?: () => void;
  onAboutCsi?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreEvents,
  onAboutCsi,
}) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Background glow accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT CONTENT (7 columns on large) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#1D68F2] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#0A192F]">
                Computer Society of India • KKWIEER Student Branch
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A192F] tracking-tight leading-[1.12] mb-6">
              Build Together <br className="hidden sm:inline" />
              for a Better <span className="text-[#1D68F2]">Tomorrow</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
              A vibrant community of technologists, problem solvers, and changemakers at KKWIEER, fostering innovation, collaboration, and student leadership.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Button
                onClick={() => (onExploreEvents ? onExploreEvents() : scrollTo("events-section"))}
                className="bg-[#1D68F2] hover:bg-blue-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={() => (onAboutCsi ? onAboutCsi() : scrollTo("AboutUs"))}
                variant="outline"
                className="bg-white hover:bg-slate-50 text-[#0A192F] border-slate-200 font-semibold text-base px-7 py-3.5 rounded-xl shadow-sm transition-all"
              >
                About CSI
              </Button>
            </div>

            {/* Hero Statistics Row */}
            <div className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
                
                {/* Stat 1: 500+ Members */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2] flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#0A192F] leading-none">500+</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Student Members</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-slate-200 my-auto" />

                {/* Stat 2: 30+ Events */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2] flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#0A192F] leading-none">30+</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Events Organized</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-slate-200 my-auto" />

                {/* Stat 3: 26 Team Members */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2] flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#0A192F] leading-none">26</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Team Members</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-slate-200 my-auto" />

                {/* Stat 4: 7+ Awards */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2] flex-shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#0A192F] leading-none">7+</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Best Branch Awards</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT VISUAL COMPOSITION (5 columns on large) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Main Shaped Image Container */}
              <div className="relative overflow-hidden rounded-[28px] lg:rounded-[36px] bg-slate-100 shadow-2xl border-4 border-white aspect-[4/3] lg:aspect-[5/4] group">
                <img
                  src="/images/installation.jpg"
                  alt="KKWIEER Campus and CSI Community"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle top gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                {/* College Watermark Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold tracking-wider text-[#0A192F]">KKWIEER NASHIK</span>
                </div>
              </div>

              {/* Angled Deep Blue Polygon Badge with Vertical Typography */}
              <div className="hidden sm:flex absolute -right-3 top-6 bottom-16 w-20 bg-gradient-to-b from-[#1D68F2] to-[#0A192F] rounded-2xl shadow-xl p-3 flex-col justify-between items-center text-white border-2 border-white/20 -z-10 translate-x-3">
                <div className="flex flex-col items-center gap-6 py-4 text-[10px] tracking-[0.25em] font-bold uppercase rotate-180 [writing-mode:vertical-rl]">
                  <span className="opacity-90">TECHNOLOGY</span>
                  <span className="opacity-90">PEOPLE</span>
                  <span className="opacity-90">IDEAS</span>
                  <span className="opacity-90">IMPACT</span>
                </div>
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-5 right-2 sm:right-6 bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl p-4 shadow-xl max-w-[240px] text-left">
                <p className="text-sm font-semibold italic text-[#0A192F] leading-snug">
                  "More than just a chapter."
                </p>
                <div className="w-8 h-[2.5px] bg-[#1D68F2] rounded-full mt-2" />
                <span className="text-[10px] text-slate-400 font-medium block mt-1">CSI KKWIEER Community</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
