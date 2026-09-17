"use client";
import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Calendar, MapPin } from "lucide-react";

type Event = {
  id?: number;
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
  attendees?: number | null;
  featured?: boolean;
};

interface SnackbarProps {
  event?: Event;
  onRegisterClick?: () => void;
}

export default function Snackbar({ event, onRegisterClick }: SnackbarProps) {
  const [open, setOpen] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setOpen(false), 250);
  };

  const handleRegister = () => {
    if (onRegisterClick) {
      handleClose();
      onRegisterClick();
    } else {
      window.open("https://forms.gle/wKDSxzc9jmQknyBS7", "_blank");
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-250 ease-out ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-[440px] rounded-[28px] overflow-hidden border border-slate-200 shadow-2xl shadow-blue-900/15 bg-white text-slate-900 flex flex-col transition-all duration-250 ease-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Section: Event Poster with clean divider */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[270px] overflow-hidden bg-slate-100 border-b border-slate-200">
          <img
            src={event?.image || "/images/Eyantran2026.jpeg"}
            alt={event?.title || "e-Yantran 2026 Poster"}
            className="w-full h-full object-cover object-top"
          />

          {/* Top-Right Circular Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all duration-200 border border-slate-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Section: Themed Content (White Card Theme) */}
        <div className="relative px-6 pt-6 pb-8 sm:px-8 sm:pt-6 sm:pb-9 flex flex-col items-center text-center bg-white">

          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1D68F2] text-[11px] font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1D68F2]" />
            <span>CSI KKWIEER Flagship Event</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome to <span className="text-[#1D68F2]">{event?.title?.replace(/\s*2026\s*/i, "") || "Vision Week"}!</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed max-w-sm font-normal">
            {event?.description || "Join us for an exciting journey. Register now to participate, learn, and showcase your skills!"}
          </p>

          {/* Date & Location Pill */}
          <div className="flex items-center justify-center gap-3 mt-4 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>{event?.date || "Jan 20 – 23, 2026"}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>{event?.location || "KKWIEER Campus"}</span>
            </span>
          </div>

          {/* Pill CTA Button (Blue) */}
          <button
            onClick={handleRegister}
            className="mt-6 w-full max-w-[280px] py-3.5 px-8 rounded-full bg-[#1D68F2] hover:bg-blue-700 text-white font-black text-sm sm:text-base tracking-wider uppercase transition-all duration-200 hover:scale-105 shadow-xl shadow-blue-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
