import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  MenuIcon,
  XIcon,
  ArrowRight,
  Home,
  Info,
  Calendar,
  Image,
  Users,
  Mail,
} from "lucide-react";
import { Button } from "./button";

interface NavbarProps {
  onOpenJoinModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoinModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("home");

  const router = useRouter();

  const navigationItems = [
    { label: "Home", target: "home", path: "/" },
    { label: "About", target: "AboutUs", path: "/" },
    { label: "Events", target: "events-section", path: "/events" },
    { label: "Gallery", target: "gallery-section", path: "/gallery" },
    { label: "Team", target: "team-section", path: "/committee" },
    { label: "Contact", target: "contact-section", path: "/" },
  ];

  // Scroll detection for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active state based on route
  useEffect(() => {
    if (router.pathname === "/") {
      if (!router.asPath.includes("#")) {
        setActiveItem("home");
      }
    } else if (router.pathname.startsWith("/events")) {
      setActiveItem("/events");
    } else if (router.pathname.startsWith("/committee")) {
      setActiveItem("/committee");
    } else if (router.pathname.startsWith("/gallery")) {
      setActiveItem("/gallery");
    }
  }, [router.pathname, router.asPath]);

  const handleNavClick = (item: typeof navigationItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (item.target === "contact-section") {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (item.target && router.pathname === "/") {
      setActiveItem(item.target);
      if (item.target === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(item.target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(item.path);
        }
      }
    } else {
      setActiveItem(item.path);
      router.push(item.path);
    }
  };

  const handleJoinClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal();
    } else {
      const modalTrigger = document.getElementById("vision-week-trigger");
      if (modalTrigger) {
        modalTrigger.click();
      } else {
        window.open("https://forms.gle/wKDSxzc9jmQknyBS7", "_blank");
      }
    }
  };

  const isActive = (item: typeof navigationItems[0]) => {
    if (router.pathname === "/" && item.target) {
      return activeItem === item.target || (activeItem === "home" && item.label === "Home");
    }
    return router.pathname === item.path || activeItem === item.path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: CSI Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/csi.png"
            alt="CSI Emblem"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#0A192F] leading-none flex items-center">
              CSI <span className="text-[#1D68F2] ml-1.5 font-bold text-sm tracking-normal">KKWIEER</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">
              Students' Branch
            </span>
          </div>
        </Link>

        {/* Center: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navigationItems.map((item, index) => {
            const active = isActive(item);
            return (
              <a
                key={index}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-full ${
                  active
                    ? "text-[#1D68F2] font-semibold"
                    : "text-[#334155] hover:text-[#1D68F2] hover:bg-blue-50/60"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#1D68F2] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Join CTA & Tagline */}
        <div className="hidden md:flex items-center">
          <Button
            onClick={handleJoinClick}
            className="bg-[#1D68F2] hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 group"
          >
            <span>Join CSI</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>

          <div className="h-7 w-[1px] bg-gray-200 mx-3.5 hidden lg:block" />

          <div className="hidden lg:flex flex-col text-[8.5px] tracking-wider font-semibold text-gray-500 uppercase leading-tight">
            <span>STUDENT COMMUNITY</span>
            <span className="text-gray-400 font-normal">FOR A BETTER TOMORROW</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden gap-2">
          <Button
            onClick={handleJoinClick}
            size="sm"
            className="bg-[#1D68F2] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
          >
            <span>Join</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <XIcon className="w-6 h-6 text-gray-900" /> : <MenuIcon className="w-6 h-6 text-gray-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navigationItems.map((item, index) => {
            const active = isActive(item);
            return (
              <a
                key={index}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-[#1D68F2] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-[#1D68F2]" />}
              </a>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Button
              onClick={handleJoinClick}
              className="w-full bg-[#1D68F2] text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <span>Join CSI KKWIEER</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="text-center text-[10px] uppercase font-semibold text-gray-400 tracking-wider pt-1">
              Student Community for a Better Tomorrow
            </div>
          </div>
        </div>
      )}
    </header>
  );
};