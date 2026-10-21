import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { X, ArrowRight, Sparkles } from "lucide-react";

interface C2CPopupProps {
  posterImage?: string;
  onRegisterClick?: () => void;
}

export const C2CPopup: React.FC<C2CPopupProps> = ({
  posterImage = "/images/c2c.png",
  onRegisterClick,
}) => {
  const router = useRouter();
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

  // Prevent background scrolling while popup is visible
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
    setTimeout(() => setOpen(false), 220);
  };

  const handleRegister = () => {
    handleClose();
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      router.push("/c2c-register");
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-200 ease-out ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-fit max-w-[92vw] max-h-[94vh] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#0A192F] text-white flex flex-col items-center transition-all duration-200 ease-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Circular Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Label */}
        <div className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-900/60 via-slate-900 to-blue-900/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-blue-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>CSI KKWIEER Flagship Conclave</span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            FEE: ₹50
          </span>
        </div>

        {/* Poster Body - Clickable to register */}
        <div
          onClick={handleRegister}
          className="relative cursor-pointer group flex items-center justify-center overflow-hidden max-h-[68vh] sm:max-h-[72vh] p-2"
          title="Click to Register for From Campus to Corporate 5.0"
        >
          <img
            src={posterImage}
            alt="From Campus to Corporate 5.0 Poster"
            className="block w-auto h-auto max-h-[66vh] sm:max-h-[70vh] max-w-[88vw] sm:max-w-[420px] rounded-2xl object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>

        {/* Bottom CTA Bar */}
        <div className="w-full p-3 sm:p-3.5 bg-[#071324] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-left w-full sm:w-auto">
            <p className="text-xs font-bold text-white tracking-wide">
              From Campus to Corporate 5.0
            </p>
            <p className="text-[10px] text-slate-400">
              CSI KKWIEER Student Branch • KKWIEER, Nashik
            </p>
          </div>

          <button
            onClick={handleRegister}
            className="w-full sm:w-auto py-2 px-5 rounded-xl bg-[#1D68F2] hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default C2CPopup;
