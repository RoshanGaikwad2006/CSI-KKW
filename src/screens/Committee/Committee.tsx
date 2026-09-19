import React, { useState, useRef, useCallback, useEffect } from "react";
import { Navbar } from "../../components/ui/navbar";
import ProfileCard from "../../components/ProfileCard";
import { useRouter } from "next/router";

// Define the committee member interface
interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  year: string;
  image: string;
  linkedin?: string;
  description?: string;
}

// Define all 6 positions in order
const ALL_POSITIONS = [
  "President",
  "Vice-President",
  "Secretary",
  "Joint-Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Editorial Team",
  "Social Media Team",
  "Creative Team",
  "Technical Team",
  "Core Committee",
];

// Local optimized committee images
const CLOUDINARY_BASE = "/images/2026";

// Complete committee members data — 2026-27 batch
const committeeMembers: CommitteeMember[] = [
  // ── Core Officers ──
  { id: "1",  name: "Kasturi Shinde",     position: "President",       year: "2026", image: `${CLOUDINARY_BASE}/1.Kasturi_Shinde.png`,  linkedin: "https://www.linkedin.com/in/kasturi-shinde31/" },
  { id: "2",  name: "Rehan Pinjari",      position: "Vice-President",  year: "2026", image: `${CLOUDINARY_BASE}/2.Rehan_Pinjari.png`,   linkedin: "https://www.linkedin.com/in/rehan-pinjari/" },
  { id: "3",  name: "Sneha Shelar",       position: "Secretary",       year: "2026", image: `${CLOUDINARY_BASE}/3.Sneha_Shelar.png`,    linkedin: "https://www.linkedin.com/in/sneha-shelar-1711ab318/" },
  { id: "4",  name: "Rajas Mahajan",      position: "Joint-Secretary", year: "2026", image: `${CLOUDINARY_BASE}/4.Rajas_Mahajan.png`,   linkedin: "https://www.linkedin.com/in/rajas-mahajan-6563b72a7/" },
  { id: "5",  name: "Bhumika Jadhav",     position: "Treasurer",       year: "2026", image: `${CLOUDINARY_BASE}/5.Bhumika_Jadhav.png`,  linkedin: "https://www.linkedin.com/in/bhumika-jadhav-587203342" },
  { id: "6",  name: "Soham Bagad",        position: "Joint Treasurer", year: "2026", image: `${CLOUDINARY_BASE}/6.Soham_Bagad.png`,     linkedin: "https://www.linkedin.com/in/soham-bagad" },
  // ── Editorial Team ──
  { id: "7",  name: "Tosha Chaudhary",    position: "Editorial Team",  year: "2026", image: `${CLOUDINARY_BASE}/7.Tosha_Chaudhary.png`, linkedin: "https://www.linkedin.com/in/tosha-choudhary-0a026b2a3" },
  { id: "8",  name: "Simran Tupe",        position: "Editorial Team",  year: "2026", image: `${CLOUDINARY_BASE}/8.Simran_Tupe.png`,     linkedin: "https://www.linkedin.com/in/simrantupe/" },
  // ── Social Media Team ──
  { id: "9",  name: "Akanksha Deshmukh",  position: "Social Media Team", year: "2026", image: `${CLOUDINARY_BASE}/9.Akanksha_Deshmukh.png`, linkedin: "https://www.linkedin.com/in/akanksha-deshmukh-20414432a/" },
  { id: "10", name: "Anjali Karhale",     position: "Social Media Team", year: "2026", image: `${CLOUDINARY_BASE}/10.Anjali_Karhale.png`,  linkedin: "https://www.linkedin.com/in/anjali-karhale-b7023b341/" },
  // ── Creative Team ──
  { id: "11", name: "Sukhada Deshpande",  position: "Creative Team",   year: "2026", image: `${CLOUDINARY_BASE}/11.Sukhada_Deshpande.png`, linkedin: "https://www.linkedin.com/in/sukhada-deshpande-651b81332" },
  { id: "12", name: "Sanjana Bagul",      position: "Creative Team",   year: "2026", image: `${CLOUDINARY_BASE}/12.Sanjana_Bagul.png`,   linkedin: "https://www.linkedin.com/in/sanjana-bagul-a3358b339" },
  // ── Technical Team ──
  { id: "13", name: "Roshan Gaikwad",     position: "Technical Team",  year: "2026", image: `${CLOUDINARY_BASE}/13.Roshan_Gaikwad.png`,  linkedin: "https://www.linkedin.com/in/roshan-gaikwad-69a638328/" },
  { id: "14", name: "Rehan Shaikh",       position: "Technical Team",  year: "2026", image: `${CLOUDINARY_BASE}/14.Rehan_Shaikh.png`,    linkedin: "https://www.linkedin.com/in/rehan-shaikh113/" },
  // ── Core Committee ──
  { id: "15", name: "Pratiksha Sonawane", position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/15.Pratiksha_Sonawane.png`, linkedin: "https://www.linkedin.com/in/pratiksha-sonawane-9393b232a" },
  { id: "16", name: "Rohan Gaikwad",      position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/16.Rohan_Gaikwad.png`,   linkedin: "https://www.linkedin.com/in/rohan-gaikwad-7a2614328" },
  { id: "17", name: "Raj Sankpal",        position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/17.Raj_Sankpal.png`,     linkedin: "https://www.linkedin.com/in/raj-sankpal-a45b88321/" },
  { id: "18", name: "Arjun Sarode",       position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/18.Arjun_Sarode.png`,    linkedin: "https://www.linkedin.com/in/arjun-sarode-59294b331" },
  { id: "19", name: "Shravani Desai",     position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/19.Shravani_Desai.png`,  linkedin: "https://www.linkedin.com/in/shravani-desai-765554377" },
  { id: "20", name: "Hrutuja Patil",      position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/20.Hrutuja_Patil.png`,   linkedin: "https://www.linkedin.com/in/hrutuja-patil-404a17331/" },
  { id: "21", name: "Kalpesh Bire",       position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/21.Kalpesh_Bire.png`,    linkedin: "https://www.linkedin.com/in/kalpesh-bire-3b5833316/" },
  { id: "22", name: "Devansh Bhatt",      position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/22.Devansh_Bhatt.png`,   linkedin: "https://www.linkedin.com/in/devansh-bhatt06" },
  { id: "23", name: "Anurag Borse",       position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/23.Anurag_Borse.png`,    linkedin: "https://www.linkedin.com/in/anurag-borse-860253397/" },
  { id: "24", name: "Nayana Mane",        position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/24.Nayana_Mane.png`,     linkedin: "https://www.linkedin.com/in/nayana-mane-b40a2732a" },
  { id: "25", name: "Pratham Bhandange",  position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/25.Pratham_Bhandange.png`, linkedin: "https://www.linkedin.com/in/pratham-bhadange-aab42a32b/" },
  { id: "26", name: "Radha Boraste",      position: "Core Committee",  year: "2026", image: `${CLOUDINARY_BASE}/26.Radha_Boraste.png`,   linkedin: "https://www.linkedin.com/in/radha-boraste-94363a354" },
];

// Lazy Loading Hook
const useLazyLoading = (itemsPerPage = 12) => {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          setTimeout(() => {
            setVisibleItems((prevVisible) => prevVisible + itemsPerPage);
            setLoading(false);
          }, 500); // Small delay to show loading state
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, itemsPerPage]
  );

  const resetVisibleItems = () => {
    setVisibleItems(itemsPerPage);
  };

  return { visibleItems, loading, lastElementRef, resetVisibleItems };
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="w-full h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

// Custom Button Component
const CustomButton: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);
  
  const baseClasses =
    "font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";

  const variantClasses = {
    default: "bg-[#1D68F2] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200",
    outline:
      "border border-slate-200 hover:border-[#1D68F2] text-slate-700 hover:text-[#1D68F2] hover:bg-blue-50/70 bg-white/90 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Committee = (): JSX.Element => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const { visibleItems, loading, lastElementRef, resetVisibleItems } = useLazyLoading(12);
  const [currentVisibleItems, setCurrentVisibleItems] = useState(12);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    resetVisibleItems();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllMembers = () => {
    console.log("Navigate to all members view");
  };

  const displayMembers = committeeMembers;
  
  const filteredMembers = displayMembers.filter(
    (member) => selectedYear === "all" || member.year === selectedYear
  );

  // Sort members by position hierarchy
  const sortedMembers = filteredMembers.sort((a, b) => {
    const aIndex = ALL_POSITIONS.indexOf(a.position);
    const bIndex = ALL_POSITIONS.indexOf(b.position);

    // If position is not found, put it at the end
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const availableYears = Array.from(
    new Set(displayMembers.map((member) => member.year))
  ).sort((a, b) => b.localeCompare(a));

  // Get visible members for lazy loading
  const visibleMembers = sortedMembers.slice(0, visibleItems);
  const hasMoreMembers = visibleItems < sortedMembers.length;

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-36 pb-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CSI KKWIEER Core Team for{" "}
            {selectedYear === "all"
              ? "All Years"
              : `${selectedYear}-${String(parseInt(selectedYear) + 1).slice(
                  -2
                )}`}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Fuelled by an Unstoppable Crew, Charting the Course to Achievement
          </p>

          {/* Year Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {availableYears.map((year) => (
              <CustomButton
                key={year}
                variant={year === selectedYear ? "default" : "outline"}
                size="md"
                onClick={() => handleYearChange(year)}
              >
                {year}
              </CustomButton>
            ))}
          </div>

         
        </div>

        {/* Members Grid */}
        {sortedMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12 items-stretch justify-items-center">
              {visibleMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="w-full flex justify-center"
                  ref={
                    index === visibleMembers.length - 1 && hasMoreMembers
                      ? lastElementRef
                      : null
                  }
                >
                  <ProfileCard
                    name={member.name}
                    title={member.position}
                    avatarUrl={member.image}
                    linkedinUrl={member.linkedin}
                  />
                </div>
              ))}
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {Array.from({ length: 8 }).map((_, index) => (
                  <LoadingSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            )}

            {/* Load More Button (fallback for users who prefer manual loading) */}
            {hasMoreMembers && !loading && (
              <div className="text-center">
                <CustomButton
                  onClick={() => {
                    setCurrentVisibleItems(prev => prev + 12);
                  }}
                  variant="outline"
                  size="lg"
                  className="mb-8"
                >
                  Load More Members
                </CustomButton>
              </div>
            )}

            
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No members found for the selected year.
            </p>
          </div>
        )}

        {/* Scroll to Top Button */}
        {visibleItems > 24 && (
          <div className="fixed bottom-8 right-8">
            <CustomButton
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="rounded-full w-12 h-12 p-0 shadow-lg"
            >
              ↑
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};