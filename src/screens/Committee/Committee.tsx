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

// Complete committee members data — 2026-27 batch
const committeeMembers: CommitteeMember[] = [
  // ── Core Officers ──
  { id: "1",  name: "Kasturi Shinde",          position: "President",       year: "2026", image: "/images/2026/1.Kasturi Shinde.png" },
  { id: "2",  name: "Rehan Rais Pinjari",       position: "Vice-President",  year: "2026", image: "/images/2026/2.Rehan Pinjari.png" },
  { id: "3",  name: "Sneha Shelar",             position: "Secretary",       year: "2026", image: "/images/2026/3.Sneha Shelar.png" },
  { id: "4",  name: "Rajas Mahajan",            position: "Joint-Secretary", year: "2026", image: "/images/2026/4.Rajas Mahajan.png" },
  { id: "5",  name: "Bhumika Jadhav",           position: "Treasurer",       year: "2026", image: "/images/2026/5.Bhumika Jadhav.png" },
  { id: "6",  name: "Soham Prasad Bagad",       position: "Joint Treasurer", year: "2026", image: "/images/2026/6.Soham Bagad.png" },
  // ── Editorial Team ──
  { id: "7",  name: "Tosha S. Choudhary",       position: "Editorial Team",  year: "2026", image: "/images/2026/7.Tosha Chaudhary.png" },
  { id: "8",  name: "Simran Tupe",              position: "Editorial Team",  year: "2026", image: "/images/2026/8.Simran Tupe.png" },
  // ── Social Media Team ──
  { id: "9",  name: "Akanksha Deshmukh",        position: "Social Media Team", year: "2026", image: "/images/2026/9.Akanksha Deshmukh.png" },
  { id: "10", name: "Anjali Sachin Karhale",    position: "Social Media Team", year: "2026", image: "/images/2026/10.Anjali Karhale.png" },
  // ── Creative Team ──
  { id: "11", name: "Sukhada Santosh Deshpande", position: "Creative Team",  year: "2026", image: "/images/2026/11.Sukhada Deshpande.png" },
  { id: "12", name: "Sanjana Bharat Bagul",     position: "Creative Team",   year: "2026", image: "/images/2026/12.Sanjana Bagul.png" },
  // ── Technical Team ──
  { id: "13", name: "Roshan Gaikwad",           position: "Technical Team",  year: "2026", image: "/images/2026/13.Roshan Gaikwad.png" },
  { id: "14", name: "Rehan Shaikh",             position: "Technical Team",  year: "2026", image: "/images/2026/14.Rehan Shaikh.png" },
  // ── Core Committee ──
  { id: "15", name: "Pratiksha Rahul Sonawane", position: "Core Committee",  year: "2026", image: "/images/2026/15.Pratiksha Sonawane.png" },
  { id: "16", name: "Rohan Gaikwad",            position: "Core Committee",  year: "2026", image: "/images/2026/16.Rohan Gaikwad.png" },
  { id: "17", name: "Raj Sankpal",              position: "Core Committee",  year: "2026", image: "/images/2026/17.Raj Sankpal.png" },
  { id: "18", name: "Arjun Sarode",             position: "Core Committee",  year: "2026", image: "/images/2026/18.Arjun Sarode.png" },
  { id: "19", name: "Shravani Yogesh Desai",    position: "Core Committee",  year: "2026", image: "/images/2026/19.Shravani Desai.png" },
  { id: "20", name: "Hrutuja Patil",            position: "Core Committee",  year: "2026", image: "/images/2026/20.Hrutuja Patil.png" },
  { id: "21", name: "Kalpesh Bire",             position: "Core Committee",  year: "2026", image: "/images/2026/21.Kalpesh Bire.png" },
  { id: "22", name: "Devansh Kunal Bhatt",      position: "Core Committee",  year: "2026", image: "/images/2026/22.Devansh Bhatt.png" },
  { id: "23", name: "Anurag Narayan Borse",     position: "Core Committee",  year: "2026", image: "/images/2026/23.Anurag Borse.png" },
  { id: "24", name: "Nayana Mane",              position: "Core Committee",  year: "2026", image: "/images/2026/24.Nayana Mane.png" },
  { id: "25", name: "Pratham Milind Bhandange", position: "Core Committee",  year: "2026", image: "/images/2026/25.Pratham Bhandange.png" },
  { id: "26", name: "Radha Boraste",            position: "Core Committee",  year: "2026", image: "/images/2026/26.Radha Boraste.png" },
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
    default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    outline:
      "border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 bg-white",
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-56">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {visibleMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="flex justify-center"
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