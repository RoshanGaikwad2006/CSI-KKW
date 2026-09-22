"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";

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

  // Lock body scroll while popup is open and ensure it is cleaned up
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
        className={`relative w-fit max-w-[92vw] max-h-[94vh] rounded-[24px] overflow-hidden border border-slate-200/90 shadow-2xl shadow-blue-950/25 bg-[#FAF8F5] text-slate-900 flex flex-col items-center transition-all duration-250 ease-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Circular Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Poster Body - Clickable to register */}
        <div
          onClick={handleRegister}
          className="relative cursor-pointer group flex items-center justify-center overflow-hidden"
          title="Click to Register for Vision Week"
        >
          <img
            src={event?.image || "/images/vision-week.png"}
            alt={event?.title || "Vision Week 2026 Poster"}
            className="block w-auto h-auto max-h-[72vh] sm:max-h-[76vh] max-w-[88vw] sm:max-w-[420px] aspect-[575/1024] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>

        {/* Bottom CTA Bar */}
        <div className="w-full p-2 sm:p-2.5 bg-white border-t border-slate-200/80 flex items-center justify-center shrink-0">
          <button
            onClick={handleRegister}
            className="w-full py-1.5 sm:py-2 px-4 rounded-lg bg-[#1D68F2] hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.01] shadow-sm hover:shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
