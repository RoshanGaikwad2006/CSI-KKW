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
          <div className="flex items-center justify-center md:justify-start">
            <img
              src="/images/csi.png"
              alt="CSI Logo"
              className="w-16 h-auto md:w-20"
            />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            CSI KKWIEER Students' Branch
          </h1>
        </div>


        {/* Row 2: Address + Links (4 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Address</h4>
            <a
  href="https://www.google.com/maps/dir/K.K+Wagh+Institute+Of+Engineering+Education+and+Research,+Panchavati,+Nashik,+Maharashtra/Hirabai+Haridas+Vidyanagari,+Mumbai+Agra+Road+Amrutdham,+Panchavati,+Nashik,+Maharashtra+422003/@20.0135866,73.7810616,13z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914!1m5!1m1!1s0x3bddebab15555555:0xdb01367e9d5cf969!2m2!1d73.8222614!2d20.0135914?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D"
  target="_blank"
  rel="noopener noreferrer"
  className="block not-italic text-gray-200 text-sm leading-relaxed hover:text-white transition-colors"
>
  <address className="not-italic">
    KK Wagh Institute of Engineering Education and Research <br />
    Hirabai Haridas Vidyanagari, Amrutdham, Panchavati, <br />
    Nashik, Maharashtra 422003, India.
  </address>
</a>

          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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