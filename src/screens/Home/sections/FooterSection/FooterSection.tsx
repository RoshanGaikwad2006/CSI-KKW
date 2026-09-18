"use client";
import React from "react";
import { LinkedinIcon, InstagramIcon, MailIcon } from "lucide-react";

export const FooterSection = (): JSX.Element => {
  const footerSections = [
    {
      title: "Quick Links",
      links: ["Home", "Events", "Gallery", "About Us"],
    },
    {
      title: "Support",
      links: ["FAQs", "Feedback", "Help Center"],
    },
    {
      title: "Policies",
      links: ["Terms & Conditions", "Privacy Policy", "Disclaimer"],
    },
  ];

  const socialIcons = [
    {
      icon: <LinkedinIcon className="w-6 h-6" />,
      alt: "LinkedIn",
      href: "https://www.linkedin.com/company/csi-kkwieer/",
    },
    {
      icon: <InstagramIcon className="w-6 h-6" />,
      alt: "Instagram",
      href: "https://www.instagram.com/csi_kkwieer?utm_source=ig_web_button_share_sheet&igsh=cHZsd2pyYTZ1c3B4",
    },
    {
      icon: <MailIcon className="w-6 h-6" />,
      alt: "Email",
      href: "mailto:csi-kkwieer@kkwagh.edu.in",
    }
    
  ];

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#112240] via-[#16315c] to-[#0e1e38] text-white font-['Poppins',Helvetica] overflow-hidden">
      {/* Top subtle blue border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      
      {/* Ambient background glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-12">
        
        {/* Row 1: Title Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-white/10 text-center md:text-left gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
                Official Student Branch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CSI KKWIEER Students' Branch
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Computer Society of India • Established 1995-96
          </p>
        </div>

        {/* Row 2: Address + Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
          {/* Address */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#1D68F2] rounded-full inline-block" />
              Address
            </h4>
            <a
              href="https://www.google.com/maps/dir/K.K+Wagh+Institute+Of+Engineering+Education+and+Research,+Panchavati,+Nashik,+Maharashtra/Hirabai+Haridas+Vidyanagari,+Mumbai+Agra+Road+Amrutdham,+Panchavati,+Nashik,+Maharashtra+422003/@20.0135866,73.7810616,13z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block not-italic text-slate-300 text-xs sm:text-sm leading-relaxed hover:text-blue-400 transition-colors group"
            >
              <address className="not-italic group-hover:text-blue-300 transition-colors">
                KK Wagh Institute of Engineering Education and Research <br className="hidden sm:inline" />
                Hirabai Haridas Vidyanagari, Amrutdham, Panchavati, <br className="hidden sm:inline" />
                Nashik, Maharashtra 422003, India.
              </address>
            </a>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-400 rounded-full inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              {footerSections[0].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-200 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-400 rounded-full inline-block" />
              Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              {footerSections[2].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-200 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              {footerSections[1].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-200 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-3 mb-8">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.alt}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-[#1D68F2] hover:text-white hover:border-[#1D68F2] hover:-translate-y-1 transition-all duration-300 shadow-md backdrop-blur-sm"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} CSI KKWIEER Students' Branch. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};