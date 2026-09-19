"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface HeroSectionProps {
  onExploreEvents?: () => void;
  onAboutCsi?: () => void;
}

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, delay = 0) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [started, target, duration, delay]);
  return { value, start: () => setStarted(true) };
}


export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreEvents,
  onAboutCsi,
}) => {
  const [phase, setPhase] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  // Staggered entrance
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    [80, 220, 380, 520, 660, 800].forEach((ms, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), ms));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Stats counter trigger
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const members = useCountUp(500, 1600, 0);
  const events  = useCountUp(30,  1400, 100);
  const team    = useCountUp(26,  1200, 200);
  const awards  = useCountUp(7,   1000, 300);
  useEffect(() => {
    if (statsVisible) { members.start(); events.start(); team.start(); awards.start(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsVisible]);

  // Mouse 3D parallax on image
  const rafRef = useRef<number>(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (imageWrapRef.current) {
        imageWrapRef.current.style.transform =
          `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
      }
    });
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (imageWrapRef.current) {
      imageWrapRef.current.style.transition = "transform 0.9s cubic-bezier(0.22,1,0.36,1)";
      imageWrapRef.current.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      setTimeout(() => {
        if (imageWrapRef.current) imageWrapRef.current.style.transition = "";
      }, 900);
    }
  }, []);

  // Animation helper
  const anim = (visible: boolean, delay = 0, y = 20): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const BG = "rgba(248,250,255,1)"; // match page bg

  return (
    <section
      className="relative w-full overflow-hidden border-b border-slate-200/80"
      style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem", background: "transparent" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >



      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════ TOP ROW: text | image ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">

          {/* LEFT: badge + headline + subtitle + buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-4">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 shadow-xs mb-5 hover:bg-blue-100/70 hover:border-blue-300 hover:scale-105 hover:shadow-sm transition-all duration-300 cursor-default select-none"
              style={anim(phase >= 1, 0, 10)}
            >
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#1D68F2] opacity-70 animate-ping" style={{ animationDuration: "2s" }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1D68F2]" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0A192F]">
                Computer Society of India&nbsp;•&nbsp;KKWIEER Student Branch
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem] font-extrabold text-[#0A192F] tracking-tight leading-[1.12] mb-5">
              <span className="block" style={anim(phase >= 2, 0, 26)}>Build Together</span>
              <span className="block" style={anim(phase >= 2, 0.12, 26)}>
                for a Better{" "}
                <span className="text-[#1D68F2] relative inline-block transition-transform duration-300 hover:scale-105 cursor-default">
                  Tomorrow
                  <svg
                    className="absolute -bottom-2 left-0 w-full pointer-events-none"
                    height="8" viewBox="0 0 100 8" preserveAspectRatio="none"
                    style={{ opacity: phase >= 2 ? 0.3 : 0, transition: "opacity 0.6s ease 0.5s" }}
                  >
                    <path d="M0,6 Q50,0 100,6" fill="none" stroke="#1D68F2" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-[1.05rem] text-slate-600 leading-relaxed mb-7"
              style={anim(phase >= 3, 0, 14)}
            >
              A vibrant community of technologists, problem solvers, and changemakers
              at KKWIEER, fostering innovation, collaboration, and student leadership.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4" style={anim(phase >= 4, 0, 10)}>
              <Button
                onClick={() => onExploreEvents ? onExploreEvents() : scrollTo("events-section")}
                className="bg-[#1D68F2] hover:bg-blue-700 text-white font-semibold text-base px-7 py-3.5 rounded-full flex items-center gap-2 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/35 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: "0 8px 28px -6px rgba(29,110,245,0.42)" }}
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
              <Button
                onClick={() => onAboutCsi ? onAboutCsi() : scrollTo("AboutUs")}
                variant="outline"
                className="bg-white hover:bg-blue-50/60 text-[#0A192F] border-slate-200 hover:border-[#1D68F2]/60 hover:text-[#1D68F2] font-semibold text-base px-7 py-3.5 rounded-full shadow-xs hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                About CSI
              </Button>
            </div>
          </div>

          {/* RIGHT: team-hero.jpg — pushed up, bleeds into background */}
          <div
            className="lg:col-span-6 flex items-start justify-center lg:justify-end"
            style={{ ...anim(phase >= 2, 0.05, 0), marginTop: "-1.5rem" }}
          >
            <div
              ref={imageWrapRef}
              className="relative w-full select-none"
              style={{
                maxWidth: "600px",
                willChange: "transform",
                transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* Soft radial mask — no hard border */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  WebkitMaskImage: [
                    "radial-gradient(ellipse 96% 90% at 50% 48%,",
                    "  black 68%,",
                    "  rgba(0,0,0,0.92) 80%,",
                    "  rgba(0,0,0,0.5) 92%,",
                    "  rgba(0,0,0,0.15) 97%,",
                    "  transparent 100%",
                    ")",
                  ].join(""),
                  maskImage: [
                    "radial-gradient(ellipse 96% 90% at 50% 48%,",
                    "  black 68%,",
                    "  rgba(0,0,0,0.92) 80%,",
                    "  rgba(0,0,0,0.5) 92%,",
                    "  rgba(0,0,0,0.15) 97%,",
                    "  transparent 100%",
                    ")",
                  ].join(""),
                }}
              >
                <img
                  src="/images/team-hero.jpg"
                  alt="CSI KKWIEER Student Committee 2026-27"
                  className="w-full h-auto object-cover object-center block"
                  style={{
                    transform: phase >= 2 ? "scale(1) translateX(0)" : "scale(1.06) translateX(28px)",
                    opacity:   phase >= 2 ? 1 : 0,
                    transition: "transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s, opacity 0.85s ease 0.1s",
                  }}
                />
                {/* Left edge — subtle soft blend so left-side members remain fully visible */}
                <div className="absolute inset-y-0 left-0 w-8 sm:w-10 pointer-events-none z-10"
                  style={{ background: `linear-gradient(to right,${BG} 0%,rgba(248,250,255,0.35) 45%,transparent 100%)` }} />
                {/* Right edge */}
                <div className="absolute inset-y-0 right-0 w-10 sm:w-12 pointer-events-none z-10"
                  style={{ background: `linear-gradient(to left,${BG} 0%,rgba(248,250,255,0.3) 50%,transparent 100%)` }} />
                {/* Bottom edge — smooth fade into stats row */}
                <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
                  style={{ background: `linear-gradient(to top,${BG} 0%,rgba(248,250,255,0.6) 50%,transparent 100%)` }} />
                {/* Top edge */}
                <div className="absolute inset-x-0 top-0 h-10 pointer-events-none z-10"
                  style={{ background: `linear-gradient(to bottom,${BG} 0%,rgba(248,250,255,0.2) 60%,transparent 100%)` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ FULL-WIDTH STATS ROW ═══════════ */}
        <div
          ref={statsRef}
          className="w-full"
          style={anim(phase >= 5, 0, 12)}
        >
          <div className="w-full bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 w-full divide-x divide-y sm:divide-y-0 divide-slate-200/80">

              {/* Stat 1 — Student Members */}
              <div 
                className="group relative flex flex-col items-center justify-center text-center px-4 py-5 sm:py-6 hover:bg-blue-50/50 transition-all duration-300 cursor-default" 
                style={{ ...anim(phase >= 5, 0), transitionDelay: "0s" }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] group-hover:text-[#1D68F2] group-hover:scale-105 leading-none tabular-nums transition-all duration-300">
                  {statsVisible ? `${members.value}+` : "0+"}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 mt-2 whitespace-nowrap transition-colors duration-200">
                  Student Members
                </div>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-[#1D68F2] group-hover:w-12 transition-all duration-300 rounded-full" />
              </div>

              {/* Stat 2 — Events Organized */}
              <div 
                className="group relative flex flex-col items-center justify-center text-center px-4 py-5 sm:py-6 hover:bg-blue-50/50 transition-all duration-300 cursor-default" 
                style={{ ...anim(phase >= 5, 0), transitionDelay: "0.07s" }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] group-hover:text-[#1D68F2] group-hover:scale-105 leading-none tabular-nums transition-all duration-300">
                  {statsVisible ? `${events.value}+` : "0+"}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 mt-2 whitespace-nowrap transition-colors duration-200">
                  Events Organized
                </div>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-[#1D68F2] group-hover:w-12 transition-all duration-300 rounded-full" />
              </div>

              {/* Stat 3 — Team Members */}
              <div 
                className="group relative flex flex-col items-center justify-center text-center px-4 py-5 sm:py-6 hover:bg-blue-50/50 transition-all duration-300 cursor-default" 
                style={{ ...anim(phase >= 5, 0), transitionDelay: "0.14s" }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] group-hover:text-[#1D68F2] group-hover:scale-105 leading-none tabular-nums transition-all duration-300">
                  {statsVisible ? team.value : "0"}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 mt-2 whitespace-nowrap transition-colors duration-200">
                  Team Members
                </div>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-[#1D68F2] group-hover:w-12 transition-all duration-300 rounded-full" />
              </div>

              {/* Stat 4 — Best Branch Awards */}
              <div 
                className="group relative flex flex-col items-center justify-center text-center px-4 py-5 sm:py-6 hover:bg-blue-50/50 transition-all duration-300 cursor-default" 
                style={{ ...anim(phase >= 5, 0), transitionDelay: "0.21s" }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] group-hover:text-[#1D68F2] group-hover:scale-105 leading-none tabular-nums transition-all duration-300">
                  {statsVisible ? `${awards.value}+` : "0+"}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 mt-2 whitespace-nowrap transition-colors duration-200">
                  Best Branch Awards
                </div>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-[#1D68F2] group-hover:w-12 transition-all duration-300 rounded-full" />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Radar pulse keyframe */}
      <style>{`
        @keyframes radarPulse {
          0%  { transform: scale(0.85); opacity: 0.9; }
          60% { transform: scale(1.9);  opacity: 0; }
          100%{ transform: scale(0.85); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
