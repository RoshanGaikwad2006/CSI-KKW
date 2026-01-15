import {
  FlagIcon,
  GalleryVerticalIcon,
  HomeIcon,
  ImageIcon,
  UserSquareIcon,

  Award,
  Calendar,
  Network,
  Users,
} from "lucide-react";



import CommitteeMembersCarousel from "./sections/CommitteeMembersCarousel/CommitteeMembersCarousel";

// Import all sections
import { ComputerSocietySection } from "./sections/ComputerSocietySection";
import { FooterSection } from "./sections/FooterSection";
import { AboutUs } from "./sections/AboutUsSection";
import { EventsCarousel } from "./sections/EventsCarousel";
import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { GallerySection } from "./sections/GallerySection/GallerySection";
import { Navbar } from "../../components/ui/navbar";
import Snackbar from "@/components/ui/snackbar";

export const Home = (): JSX.Element => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsAtTop(window.scrollY < 200);
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);





  const scrollToSection = (sectionLabel: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-transparent relative z-10">
      <Snackbar event={{
        id: 6,
        title: "E-Yantran 2026",
        category: "upcoming", date: "2026-01-15",
        time: "9:00 AM", location: "Campus Wide",
        description: "Largest E-Waste Awareness & Collection Mega Drive. Volunteer registrations are open",
        image: "/images/eyantran.png",
        attendees: null,
        featured: true,
      }} />
      <div className="overflow-hidden w-full relative bg-transparent">
        <div className="relative w-full bg-transparent">

          <Navbar />

          {/* Main content sections */}
          <div className="relative w-full pt-16 lg:pt-0 bg-transparent">



            {/* Computer Society Section - Fixed */}
            <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
              <ComputerSocietySection />
            </div>

            {/* Spacer for fixed section */}
            <div className="h-screen"></div>

            {/* Content that slides over ComputerSocietySection */}
            <div className="relative z-20 bg-white px-5 lg:px-20">
              <div className="p-4 mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-3 sm:gap-4 lg:gap-5 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[350px]">

                {/* Main CSI Logo Section */}
                <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                  <div className="relative">
                    <img
                      src="/images/csi.png"
                      alt="CSI Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-lg -z-10"></div>
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-blue-800 mt-2 sm:mt-4 text-center">
                    Computer Society of India
                  </h3>
                  <p className="text-blue-600 text-center mt-1 sm:mt-2 text-xs sm:text-sm lg:text-sm">
                    KKWIEER Chapter
                  </p>
                </div>

                {/* Team Members */}
                <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-4" />
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold mb-2">26</div>
                    <div className="text-sm sm:text-base font-semibold">Strong & Committed</div>
                    <div className="text-xs sm:text-sm text-blue-100 mt-1">Team Members</div>
                  </div>
                </div>


                {/* Events Organized */}
                <div className="lg:row-span-2 lg:col-start-1 lg:row-start-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-5 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold mb-1">30+</div>
                  <div className="text-xs sm:text-sm lg:text-sm font-medium text-center">Events Organized</div>
                  <div className="text-xs lg:text-xs text-blue-100 text-center mt-1">This Year</div>
                </div>

                {/* Student Branches */}
                <div className="lg:row-span-2 lg:col-start-2 lg:row-start-5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-5 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Network className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold mb-1">72</div>
                  <div className="text-xs sm:text-sm lg:text-sm font-medium text-center">Student Branches</div>
                  <div className="text-xs lg:text-xs text-blue-100 text-center mt-1">Across Region</div>
                </div>
                {/* Networking → now RIGHT TOP */}
                <div className="sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-5 flex items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                  <div className="bg-blue-600 rounded-full p-2 sm:p-3 lg:p-3 mr-3 sm:mr-4 lg:mr-5 flex-shrink-0">
                    <Network className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-bold text-blue-800 mb-1 sm:mb-2">Networking</h4>
                    <p className="text-blue-700 text-xs sm:text-sm lg:text-sm leading-relaxed">
                      Building valuable connections and collaborations within the tech community.
                    </p>
                  </div>
                </div>

                {/* Leadership → now RIGHT BOTTOM */}
                <div className="sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-5 flex items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                  <div className="bg-blue-500 rounded-full p-2 sm:p-3 lg:p-3 mr-3 sm:mr-4 lg:mr-5 flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-bold text-blue-800 mb-1 sm:mb-2">Leadership</h4>
                    <p className="text-blue-700 text-xs sm:text-sm lg:text-sm leading-relaxed">
                      Guiding and inspiring others toward a common goal through innovation and excellence.
                    </p>
                  </div>
                </div>
                <Card className="sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl sm:rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">
                    CSI India
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center sm:text-justify max-w-prose">
                    The seed for the Computer Society of India (CSI) was first shown in the year 1965
                    with a handful of IT enthusiasts who were a computer user group and felt the need
                    to organize their activities. They also wanted to share their knowledge and exchange
                    ideas on what they felt was a fast emerging sector. Today the CSI takes pride in being
                    the largest and most professionally managed...
                  </p>
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full sm:w-auto">
                      <a href="https://csiindia.org/" target="_blank" rel="noopener noreferrer">Read more</a>
                    </Button>
                  </div>
                </Card>



                {/* CSI Nashik Chapter */}
                <Card className="sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl sm:rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">
                    CSI Nashik Chapter
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center sm:text-justify max-w-prose">
                    Nashik chapter of Computer Society of India (CSI) was formed in 1988-89.
                    During the years, the chapter conducted several activities. We have won
                    the Best Chapter award several times. The First student branch was formed
                    in 1992, Today there are more than 20 student branches in and around Nashik.
                    Our ACCESS has won the Best Newsletter Award several times. The student...
                  </p>
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full sm:w-auto">
                      <a href="https://www.csi-nashik.org.in/" target="_blank" rel="noopener noreferrer">Read more</a>
                    </Button>
                  </div>
                </Card>

              </div>
            </div>

            <div id="AboutUs" className="bg-gray-50">
              <AboutUs />
            </div>


            {/* Committee Carousel Section */}
            <CommitteeMembersCarousel />

            <div className="bg-blue-50">
              <EventsCarousel />
            </div>

            <GallerySection />

            {/* Footer Section */}
            <div className="w-full bg-[#1e1e1e]">
              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};