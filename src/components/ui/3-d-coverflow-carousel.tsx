"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Inline or Lucide Icons
const ChevronLeftIcon = () => (
  <ChevronLeft className="w-5 h-5 text-white" />
);

const ChevronRightIcon = () => (
  <ChevronRight className="w-5 h-5 text-white" />
);

const ArrowRightIcon = () => (
  <ArrowRight className="w-3.5 h-3.5" />
);

export interface CarouselItem {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  ctaText?: string;
  ctaUrl?: string;
  linkedin?: string;
  /** Override the global autoplayDelay for this specific slide (in ms) */
  delay?: number;
}

export interface CoverFlowCarouselProps {
  items?: CarouselItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  className?: string;
  accentColor?: string;
  onCtaClick?: (item: CarouselItem) => void;
}

export const defaultDishes: CarouselItem[] = [
  {
    tag: "#Signature",
    titleLine1: "BUTTER CHICKEN",
    titleLine2: "– DELHI HERITAGE",
    desc: "Velvety roasted tomato and fenugreek gravy with tender charred chicken",
    img: "https://cdn.21st.dev/assets/mirror/84/84cb320f9692895054c9e1774ca48848f1c9c62ccba43ad8ad0b186460bb3751.jpg",
    ctaText: "View Menu",
    ctaUrl: "#",
  },
  {
    tag: "#ChefSpecial",
    titleLine1: "TANDOORI CHOPS",
    titleLine2: "– SMOKED SPICE",
    desc: "Grass-fed lamb chops charred in live charcoal tandoor with Kashmiri spices",
    img: "https://cdn.21st.dev/assets/mirror/a4/a4712dee84e12432f1d3a1a3234914c0281c9bb12692e4bc8da5eaa4355bec33.jpg",
    ctaText: "View Menu",
    ctaUrl: "#",
  },
  {
    tag: "#Vegetarian",
    titleLine1: "PANEER TIKKA",
    titleLine2: "– CLAY ROASTED",
    desc: "Artisan cottage cheese marinated in spiced yogurt, bell peppers & saffron",
    img: "https://cdn.21st.dev/assets/mirror/56/56a6950cf4a436af231cf7cd707189e121e65934066f851c744bdab0cfee64d4.jpg",
    ctaText: "View Menu",
    ctaUrl: "#",
  },
  {
    tag: "#CoastalCatch",
    titleLine1: "MALABAR PRAWNS",
    titleLine2: "– COCONUT GRAVY",
    desc: "Jumbo wild tiger prawns simmered in fragrant curry leaves and coconut milk",
    img: "https://cdn.21st.dev/assets/mirror/a3/a32877b070c563bbbcf54b6104761b1516814625209c806ee8b60f8a69598cd1.jpg",
    ctaText: "View Menu",
    ctaUrl: "#",
  },
  {
    tag: "#ArtisanBake",
    titleLine1: "TRUFFLE NAAN",
    titleLine2: "– CHARCOAL OVEN",
    desc: "Crispy puffed leavened bread brushed with pure ghee and black winter truffle",
    img: "https://cdn.21st.dev/assets/mirror/5c/5c1b6f03cc2ace649f9025f304ca4fdce74cd413504e65a00ef3f68152e8ed92.jpg",
    ctaText: "View Menu",
    ctaUrl: "#",
  },
];

// Local optimized committee images
const CLOUDINARY_BASE = "/images/2026";

// Default CSI Committee Member items — 2026-27 batch
export const defaultCsiCommitteeItems: CarouselItem[] = [
  {
    tag: "#President",
    titleLine1: "KASTURI SHINDE",
    titleLine2: "– PRESIDENT",
    desc: "Leading the CSI KKWIEER Student Branch with strategic vision, leadership, and technical excellence.",
    img: `${CLOUDINARY_BASE}/1.Kasturi_Shinde.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/kasturi-shinde31/",
  },
  {
    tag: "#Vice-President",
    titleLine1: "REHAN PINJARI",
    titleLine2: "– VICE PRESIDENT",
    desc: "Directing student engagement, event planning, and inter-collegiate technical initiatives.",
    img: `${CLOUDINARY_BASE}/2.Rehan_Pinjari.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/rehan-pinjari/",
  },
  {
    tag: "#Secretary",
    titleLine1: "SNEHA SHELAR",
    titleLine2: "– SECRETARY",
    desc: "Orchestrating chapter administration, team communication, and member records.",
    img: `${CLOUDINARY_BASE}/3.Sneha_Shelar.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/sneha-shelar-1711ab318/",
  },
  {
    tag: "#Joint-Secretary",
    titleLine1: "RAJAS MAHAJAN",
    titleLine2: "– JOINT SECRETARY",
    desc: "Coordinating logistical operations and technical workshop arrangements across departments.",
    img: `${CLOUDINARY_BASE}/4.Rajas_Mahajan.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/rajas-mahajan-6563b72a7/",
  },
  {
    tag: "#Treasurer",
    titleLine1: "BHUMIKA JADHAV",
    titleLine2: "– TREASURER",
    desc: "Overseeing financial planning, event sponsorships, and budget management.",
    img: `${CLOUDINARY_BASE}/5.Bhumika_Jadhav.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/bhumika-jadhav-587203342",
  },
  {
    tag: "#Joint-Treasurer",
    titleLine1: "SOHAM BAGAD",
    titleLine2: "– JOINT TREASURER",
    desc: "Managing resource allocation and financial reporting for national and regional events.",
    img: `${CLOUDINARY_BASE}/6.Soham_Bagad.png`,
    ctaText: "LinkedIn Profile",
    ctaUrl: "https://www.linkedin.com/in/soham-bagad",
  },
];

export function CoverFlowCarousel({
  items = defaultDishes,
  sectionLabel = "BEST SELLERS",
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = false,
  className = "",
  accentColor = "#c5a880",
  onCtaClick,
}: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx % total);
  };

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    if (pauseOnHover && isHovered) return;

    const currentDelay = items[currentIndex]?.delay ?? autoplayDelay;
    const timeout = setTimeout(() => {
      nextSlide();
    }, currentDelay);

    return () => clearTimeout(timeout);
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered, nextSlide, total, currentIndex, items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      className={`relative w-full min-h-[760px] flex items-center justify-center overflow-hidden py-12 select-none ${className}`}
      style={{
        backgroundColor: "#0c0a09",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={items[currentIndex]?.img}
          alt="ambience background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.22) blur(32px)",
            transform: "scale(1.15)",
            transition: "opacity 1000ms ease, filter 1000ms ease",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(12,10,9,0.3) 0%, rgba(12,10,9,0.92) 100%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 z-10 flex flex-col items-center">
        {/* Eyebrow */}
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <span style={{ width: "36px", height: "1px", background: `linear-gradient(90deg, transparent, ${accentColor})` }} />
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: accentColor,
                margin: 0,
              }}
            >
              {sectionLabel}
            </h3>
            <span style={{ width: "36px", height: "1px", background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          </div>
        )}

        {/* 3D Coverflow Stage */}
        <div
          className="relative w-full h-[520px] flex justify-center items-center mb-8"
          style={{ perspective: "1400px" }}
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = "translateX(0px) scale(0.4) rotateY(0deg)";
            let opacity = 0;
            let zIndex = 0;
            let filter = "brightness(0.4) blur(2px)";
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = "translateX(0px) scale(1) rotateY(0deg)";
              opacity = 1;
              zIndex = 30;
              filter = "brightness(1)";
            } else if (offset === 1) {
              transform = "translateX(285px) scale(0.84) rotateY(-24deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.75)";
            } else if (offset === 2) {
              transform = "translateX(510px) scale(0.68) rotateY(-38deg)";
              opacity = 0.38;
              zIndex = 10;
              filter = "brightness(0.55) blur(1px)";
            } else if (offset === total - 1) {
              transform = "translateX(-285px) scale(0.84) rotateY(24deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.75)";
            } else if (offset === total - 2) {
              transform = "translateX(-510px) scale(0.68) rotateY(38deg)";
              opacity = 0.38;
              zIndex = 10;
              filter = "brightness(0.55) blur(1px)";
            }

            return (
              <div
                key={idx}
                onClick={() => !isCenter && goToSlide(idx)}
                style={{
                  position: "absolute",
                  width: "300px",
                  height: "520px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  border: isCenter
                    ? "1.5px solid rgba(29,110,245,0.22)"
                    : "1px solid rgba(200,210,230,0.4)",
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: "center center",
                  transition: "all 800ms cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: isCenter
                    ? `0 28px 60px rgba(0,0,0,0.22), 0 0 40px ${accentColor}22`
                    : "0 12px 30px rgba(0,0,0,0.18)",
                  cursor: isCenter ? "default" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* ── Photo area: objectFit contain so full portrait is visible ── */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    flex: "0 0 68%",
                    backgroundColor: "#eef2fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.titleLine1}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      display: "block",
                    }}
                  />
                  {/* Tag badge */}
                  <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "#ffffff",
                        background: accentColor,
                        padding: "3px 9px",
                        borderRadius: "999px",
                        boxShadow: `0 2px 8px ${accentColor}55`,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* ── Text panel: clean white area below photo ── */}
                <div
                  style={{
                    flex: "1 1 auto",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 14px 14px",
                    borderTop: "1px solid rgba(29,110,245,0.1)",
                    gap: "5px",
                    transition: "opacity 500ms ease",
                  }}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      width: "26px",
                      height: "2px",
                      backgroundColor: accentColor,
                      borderRadius: "2px",
                      boxShadow: `0 0 5px ${accentColor}88`,
                      marginBottom: "1px",
                    }}
                  />

                  {/* Name */}
                  <h2
                    style={{
                      fontSize: isCenter ? "0.95rem" : "0.82rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "#0A192F",
                      margin: 0,
                      lineHeight: 1.2,
                      textAlign: "center",
                      transition: "font-size 400ms ease",
                    }}
                  >
                    {item.titleLine1}
                  </h2>

                  {/* Role */}
                  {item.titleLine2 && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: accentColor,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.titleLine2}
                    </span>
                  )}

                  {/* Description — center card only */}
                  {item.desc && isCenter && (
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "#64748b",
                        maxWidth: "230px",
                        margin: "2px 0 3px",
                        lineHeight: 1.4,
                        textAlign: "center",
                      }}
                    >
                      {item.desc}
                    </p>
                  )}

                  {/* LinkedIn button — center card only */}
                  <a
                    href={item.ctaUrl || "#"}
                    onClick={(e) => {
                      if (onCtaClick) {
                        e.preventDefault();
                        onCtaClick(item);
                      } else if (item.ctaUrl && item.ctaUrl !== "#") {
                        window.open(item.ctaUrl, "_blank");
                      }
                    }}
                    style={{
                      display: isCenter ? "inline-flex" : "none",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      background: `linear-gradient(135deg, ${accentColor} 0%, #1148ab 100%)`,
                      color: "#ffffff",
                      fontSize: "0.63rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      boxShadow: `0 4px 12px ${accentColor}44`,
                      cursor: "pointer",
                      marginTop: "2px",
                    }}
                  >
                    <span>{item.ctaText || "View Profile"}</span>
                    <ArrowRightIcon />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            zIndex: 40,
            transition: "all 200ms ease",
          }}
        >
          <ChevronLeftIcon />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            zIndex: 40,
            transition: "all 200ms ease",
          }}
        >
          <ChevronRightIcon />
        </button>

        {/* Pagination Dots */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", zIndex: 30 }}>
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                height: "8px",
                width: idx === currentIndex ? "28px" : "8px",
                borderRadius: "9999px",
                backgroundColor: idx === currentIndex ? accentColor : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                boxShadow: idx === currentIndex ? `0 0 10px ${accentColor}` : "none",
                transition: "all 300ms ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Component = CoverFlowCarousel;
export default CoverFlowCarousel;
