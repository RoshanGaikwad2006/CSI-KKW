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

export function CoverFlowCarousel({
  items = [],
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

  // Preload all carousel images into memory once on mount to prevent repeated network calls
  useEffect(() => {
    if (typeof window !== "undefined" && items && items.length > 0) {
      items.forEach((item) => {
        if (item.img) {
          const img = new Image();
          img.src = item.img;
        }
      });
    }
  }, [items]);

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
      {/* Background Ambience — High performance CSS gradient without re-fetching backdrop images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${accentColor}18 0%, rgba(12,10,9,0.96) 85%)`,
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
