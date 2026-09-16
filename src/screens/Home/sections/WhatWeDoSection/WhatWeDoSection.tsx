import React from "react";
import { Users, BarChart3, Lightbulb, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export const WhatWeDoSection: React.FC = () => {
  const pillars = [
    {
      id: "networking",
      icon: Users,
      title: "Networking",
      description: "Connect with industry experts, alumni and a like-minded community.",
      linkText: "Connect with us",
      linkHref: "/committee",
    },
    {
      id: "leadership",
      icon: BarChart3,
      title: "Leadership",
      description: "Develop skills, take initiative and create real impact.",
      linkText: "Join leadership",
      linkHref: "/committee",
    },
    {
      id: "innovation",
      icon: Lightbulb,
      title: "Innovation",
      description: "Explore new ideas, build solutions and turn possibilities into reality.",
      linkText: "View projects",
      linkHref: "/events",
    },
    {
      id: "community",
      icon: Heart,
      title: "Community",
      description: "A supportive space to learn, collaborate and grow together.",
      linkText: "Our family",
      linkHref: "/gallery",
    },
  ];

  return (
    <section id="what-we-do-section" className="w-full py-14 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
              What We Do
            </h2>
            <div className="w-10 h-1 bg-[#1D68F2] rounded-full mt-1" />
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D68F2] hover:text-blue-700 transition-colors group"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Circular Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2] mb-5 group-hover:bg-[#1D68F2] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0A192F] mb-2 tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                {/* Arrow link */}
                <div className="pt-2 flex items-center gap-1 text-sm font-semibold text-[#1D68F2] group-hover:text-blue-700 transition-colors">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhatWeDoSection;
