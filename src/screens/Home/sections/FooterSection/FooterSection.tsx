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
    <footer className="w-full bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 text-white font-['Poppins',Helvetica]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        
        {/* Row 1: Logos + Title (inline) */}
        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-10 text-center md:text-left">
  {/* Logos */}
  <div className="flex items-center justify-center md:justify-start space-x-4">
    <img
      src="/images/csi.png"
      alt="CSI Logo"
      className="w-16 h-auto md:w-20"
    />
    <img
      src="/images/CSIwhite.svg"
      alt="CSI KKW Logo"
      className="w-28 h-28 md:w-26 md:h-16"
    />
  </div>

  {/* Title */}
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
    CSI KKWIEER Students' Branch
  </h1>
</div>


        {/* Row 2: Address + Links (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Address (Spans full width on mobile) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Address</h4>
            <a
              href="https://www.google.com/maps/dir/K.K+Wagh+Institute+Of+Engineering+Education+and+Research,+Panchavati,+Nashik,+Maharashtra/Hirabai+Haridas+Vidyanagari,+Mumbai+Agra+Road+Amrutdham,+Panchavati,+Nashik,+Maharashtra+422003/@20.0135866,73.7810616,13z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block not-italic text-gray-200 text-xs sm:text-sm leading-relaxed hover:text-white transition-colors"
            >
              <address className="not-italic">
                KK Wagh Institute of Engineering Education and Research <br className="hidden sm:inline" />
                Hirabai Haridas Vidyanagari, Amrutdham, Panchavati, <br className="hidden sm:inline" />
                Nashik, Maharashtra 422003, India.
              </address>
            </a>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-200">
              {footerSections[0].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies (Placed to the right of Quick Links on Mobile) */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Policies</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-200">
              {footerSections[2].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Support</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-200">
              {footerSections[1].links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.alt}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/20 pt-4 text-center">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} CSI KKWIEER. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};