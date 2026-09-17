import React from "react";
import { useRouter } from "next/router";
import { Navbar } from "../../components/ui/navbar";
import { HeroSection } from "./sections/HeroSection";
import { EventsCarousel } from "./sections/EventsCarousel";
import { GallerySection } from "./sections/GallerySection/GallerySection";
import { AboutUs } from "./sections/AboutUsSection";
import CommitteeMembersCarousel from "./sections/CommitteeMembersCarousel/CommitteeMembersCarousel";
import { FooterSection } from "./sections/FooterSection";
import Snackbar from "../../components/ui/snackbar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Award, Network, Users, Calendar } from "lucide-react";

export const Home = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white relative font-['Inter',sans-serif] text-slate-900 overflow-x-hidden">
      
      {/* 1. Vision Week Event Popup Card */}
      <Snackbar
        event={{
          id: 6,
          title: "Vision Week 2026",
          category: "upcoming",
          date: "March 12 – 16, 2026",
          time: "9:00 AM",
          location: "KKWIEER Campus",
          description: "Join us for an exciting journey. Register now to participate, learn, and showcase your skills!",
          image: "/images/Eyantran2026.jpeg",
          attendees: null,
          featured: true,
        }}
        onRegisterClick={() => router.push("/vision-week-register")}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar onOpenJoinModal={() => router.push("/vision-week-register")} />

      {/* 3. New Hero Section (Reference Design) */}
      <HeroSection
        onExploreEvents={() => {
          const el = document.getElementById("events-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onAboutCsi={() => {
          const el = document.getElementById("AboutUs");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 4. Upcoming Events Section (Reference Layout + Vision Week 2026) */}
      <EventsCarousel />

      {/* 5. Moments That Matter Gallery Section (Reference Layout) */}
      <GallerySection />

      {/* 7. CSI Chapter Leadership & Parent Bodies (Preserved Overview Cards) */}
      <section className="w-full py-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A192F]">
              Affiliation & Chapter Legacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connecting our student branch with national and regional computer science leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CSI India Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2]">
                    <Network className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0A192F]">CSI India (National Body)</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Founded in 1965 by IT pioneers, the Computer Society of India is the largest association of computer professionals in the nation. It facilitates technical dissemination through journals, conventions, and support for student research.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-blue-200 text-[#1D68F2] hover:bg-blue-50"
                  onClick={() => window.open("https://csiindia.org/", "_blank")}
                >
                  Visit CSI India Portal →
                </Button>
              </div>
            </div>

            {/* CSI Nashik Chapter Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D68F2]">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0A192F]">CSI Nashik Chapter</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Formed in 1988-89, the Nashik Chapter has repeatedly received Best Chapter recognitions. With over 20 active student branches, it leads technical seminars, regional coding competitions, and community outreach initiatives.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-blue-200 text-[#1D68F2] hover:bg-blue-50"
                  onClick={() => window.open("https://www.csi-nashik.org.in/", "_blank")}
                >
                  Visit Nashik Chapter Portal →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. About Us Detailed Section with Accordion & PDF Reports (Preserved) */}
      <div id="AboutUs" className="w-full bg-white border-t border-slate-100">
        <AboutUs />
      </div>

      {/* 9. Committee Leadership Preview Carousel (Preserved) */}
      <div id="team-section" className="w-full bg-slate-50/70 border-t border-slate-200/80">
        <CommitteeMembersCarousel />
      </div>

      {/* 10. Modern Footer Section (Preserved & Enhanced) */}
      <div className="w-full">
        <FooterSection />
      </div>

    </div>
  );
};

export default Home;