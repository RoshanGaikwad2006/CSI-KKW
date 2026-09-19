import { useState, useEffect } from "react";
import { Award, Calendar, ChevronDown, ChevronUp, Network, Users, FileText, X, ExternalLink, Download, Maximize2, Minimize2 } from "lucide-react";

export const AboutUs = () => {
  const [expanded, setExpanded] = useState(false);
  const [activityReportsExpanded, setActivityReportsExpanded] = useState(false);
  const [committeeListsExpanded, setCommitteeListsExpanded] = useState(false);
  const [pdfModal, setPdfModal] = useState({ isOpen: false, url: "", title: "", type: "" });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const committeeData = [
    { year: "2023-2024", link: "pdfs/csi-committee-list-2023-24.pdf" },
    { year: "2022-2023", link: "pdfs/csi-committee-list-2022-23.pdf" },
    { year: "2021-2022", link: "pdfs/csi-committee-list-2021-22.pdf" },
    { year: "2020-2021", link: "pdfs/csi-committee-list-2020-21.pdf" },
    { year: "2019-2020", link: "pdfs/csi-committee-list-2019-02.pdf" },
  ];

  const activityReports = [
    { year: "2022-2023", link: "pdfs/2022-23-ar.pdf" },
    { year: "2021-2022", link: "pdfs/2021-22-ar.pdf" },
    { year: "2020-2021", link: "pdfs/2020-21-ar.pdf"},
    { year: "2019-2020", link: "pdfs/2019-20-cr.pdf"},
    { year: "2018-2019", link: "pdfs/2021-22-ar.pdf" },
    { year: "2017-2018", link: "pdfs/2021-22-ar.pdf" },
    { year: "2016-2017", link: "pdfs/2021-22-ar.pdf" },
    { year: "2015-2016", link: "pdfs/2021-22-ar.pdf" },
    { year: "2014-2015", link: "pdfs/2021-22-ar.pdf" },
  ];

  // Function to open PDF in modal
  const openPdfModal = (url, title, type) => {
    setPdfLoading(true);
    setPdfError(false);
    setPdfModal({ isOpen: true, url: url, title: title, type: type });
  };

  // Function to close PDF modal
  const closePdfModal = () => {
    setPdfModal({ isOpen: false, url: "", title: "", type: "" });
    setPdfLoading(false);
    setPdfError(false);
    setIsFullscreen(false);
  };

  // Handle PDF load success
  const handlePdfLoad = () => {
    setPdfLoading(false);
    setPdfError(false);
  };

  // Handle PDF load error
  const handlePdfError = () => {
    setPdfLoading(false);
    setPdfError(true);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Lock body scroll when PDF modal is open and ensure it is restored on close or unmount
  useEffect(() => {
    if (pdfModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [pdfModal.isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && pdfModal.isOpen) {
        closePdfModal();
      }
    };

    if (pdfModal.isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [pdfModal.isOpen]);

  // Create Google Docs viewer URL for better PDF compatibility
  const getViewerUrl = (url) => {
    // Use direct URL for local files, Google Docs viewer for external files
    if (url.startsWith('http') || url.startsWith('https')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    } else {
      // For local files, use the direct path
      return url;
    }
  };

  return (
    <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
          About Us
        </h2>
        <div className="w-10 h-1 bg-[#1D68F2] rounded-full mt-1" />
      </div>

      {/* Intro (always visible) */}
      <p className="text-slate-600 text-sm sm:text-base md:text-[1.05rem] leading-relaxed mb-6 text-left max-w-5xl">
        The CSI student branch at KKWIEER, established in 1995-96, is one of the most vibrant in Maharashtra & Goa.
        Recognized 7 times as the "Best Student Branch", it has over 500 student members and organizes regular technical
        events such as quizzes, seminars, and workshops. Faculty and students benefit from publications, communication
        networks, and financial support for research.
      </p>

      {/* Modern Read More/Less Button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 
               bg-white hover:bg-[#1D68F2] text-[#1D68F2] hover:text-white font-semibold rounded-xl border border-blue-200 hover:border-[#1D68F2]
               transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
        >
          <span>
            {expanded ? "Read Less" : "Read More About CSI KKWIEER"}
          </span>

          <div className="transition-transform duration-300 ease-out group-hover:translate-y-[-1px]">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded Content with Smooth Animation */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded
          ? "max-h-[5000px] opacity-100"
          : "max-h-0 opacity-0"
          }`}
      >
        <div className="space-y-6 sm:space-y-8 md:space-y-10 pt-4">
          {/* Detailed Info */}
          <div className="text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed transform transition-transform duration-500 ease-out text-left max-w-5xl">
            <p className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              CSI was founded in 1965 by a small group of IT professionals who wanted to exchange ideas and organize activities
              in the emerging computer science field. Today, CSI is the largest and most professionally managed association for
              IT professionals in India with over 100,000 members.
            </p>
            <p className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Members include software developers, scientists, academicians, CIOs, CTOs, and vendors across various sectors.
              CSI currently has over 500 student branches across 73+ locations and aims to expand further into smaller towns and cities.
            </p>
            <p className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              At KKWIEER, Prof. A. V. Kolapkar leads the student branch as Coordinator and has received the "Best Student Branch Coordinator" award.
              Faculty receive access to CSI Journals and Communications, and both students and faculty benefit from research grants and tech exposure.
              Prof. Dr. S. S. Sane, a key contributor, now serves as Regional Vice President for Maharashtra & Goa.
            </p>
          </div>

          {/* Images remain the same */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="w-full max-w-4xl mx-auto">
              <img
                src="/images/csi_img1.png"
                alt="Prof. Dr. S.S. Sane receiving Best Student Branch Award"
                className="w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[350px] lg:max-h-[400px] object-contain rounded-lg sm:rounded-xl transition-transform duration-500 shadow-md"
              />
              <p className="text-xs sm:text-sm text-gray-600 text-center font-medium mt-2 px-2">
                Prof. Dr. S.S. Sane receiving "Best Student Branch" Award on 51th Annual Convention at Coimbatore. The seed for the Computer Society of India (CSI) was first sown in the year 1965 with a handful of IT enthusiasts who were a computer user group and felt the need to organize their activities.
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="w-full max-w-4xl mx-auto">
              <img
                src="/images/csi_img2.png"
                alt="Mr. A. V. Kolapkar receiving Longest Continuous Student Branch Counselor Award"
                className="w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[350px] lg:max-h-[400px] object-contain rounded-lg sm:rounded-xl transition-transform duration-500 shadow-md"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center font-medium px-2">
                Mr. A. V. Kolapkar receiving "Longest Continuous Student Branch Counselor" Award from CSI President Prof. Bipin Mehta on 5dec 2015 at CSI Golden Jubilee Annual convention at New Delhi
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="w-full max-w-4xl mx-auto">
              <img
                src="/images/csi_img3.png"
                alt="Mr. Khitij Khakurdikar receiving Highest Committed Student Branch Activist Award"
                className="w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[350px] lg:max-h-[400px] object-contain rounded-lg sm:rounded-xl transition-transform duration-500  shadow-md"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center font-medium px-2">
                Mr. Khitij Khakurdikar receiving "Highest Committed Student Branch Activist" Award by CSI President on 2013 at CSI Annual convention at Vishakapattanam
              </p>
            </div>
          </div>

          {/* Activity Reports Section with Enhanced Cards */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <div className="flex justify-center mb-6 sm:mb-8">
              <button
                onClick={() => setActivityReportsExpanded(!activityReportsExpanded)}
                className="group relative inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 
                bg-white text-blue-600 font-medium rounded-full 
                transition-all duration-300 ease-out
                focus:outline-none 
                min-w-[220px] justify-center
                "
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm sm:text-base">
                  {activityReportsExpanded ? "Hide Activity Reports" : "View Activity Reports"}
                </span>
                <div className="transition-transform duration-300 ease-out group-hover:translate-y-[-1px]">
                  {activityReportsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
                <span className="absolute left-0 -bottom-2 w-full h-[2px] sm:h-[3px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 rounded-full"></span>
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${activityReportsExpanded
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-4">
                {activityReports.map((report, index) => (
                  <div
                    key={report.year}
                    className="group bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 animate-fade-in-up hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 sm:p-3 shadow-lg">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                            Activity Report
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">{report.year}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openPdfModal(report.link, `Activity Report ${report.year}`, "Activity Report")}
                        className="inline-flex items-center flex-1 justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Report
                      </button>
                      <a
                        href={report.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Committee Lists Section with Enhanced Cards */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <div className="flex justify-center mb-6 sm:mb-8">
              <button
                onClick={() => setCommitteeListsExpanded(!committeeListsExpanded)}
                className="group relative inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 
                bg-white text-blue-600 font-medium rounded-full 
                transition-all duration-300 ease-out
                focus:outline-none 
                min-w-[220px] justify-center
                 "
              >
                <Users className="w-4 h-4" />
                <span className="text-sm sm:text-base">
                  {committeeListsExpanded ? "Hide Committee Lists" : "View Committee Lists"}
                </span>
                <div className="transition-transform duration-300 ease-out group-hover:translate-y-[-1px]">
                  {committeeListsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
                <span className="absolute left-0 -bottom-2 w-full h-[2px] sm:h-[3px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 rounded-full"></span>
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${committeeListsExpanded
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-4">
                {committeeData.map((committee, index) => (
                  <div
                    key={committee.year}
                    className="group bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 animate-fade-in-up hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 sm:p-3 shadow-lg">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                            Committee List
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">{committee.year}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openPdfModal(committee.link, `Committee List ${committee.year}`, "Committee List")}
                        className="inline-flex items-center flex-1 justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View List
                      </button>
                      <a
                        href={committee.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Enhanced Creative PDF Modal - Made mobile responsive */}
      {pdfModal.isOpen && (
        <>
          {/* Backdrop with animated gradient */}
          <div 
            className={`fixed inset-0 z-50 transition-all duration-500 ease-out
              ${pdfModal.isOpen ? 'backdrop-blur-sm bg-gradient-to-br from-black/60 via-blue-900/40 to-purple-900/60' : 'backdrop-blur-none bg-transparent'}`}
            onClick={closePdfModal}
          >
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-bounce animation-delay-3000"></div>
            </div>
            
            {/* Modal Container */}
            <div 
              className={`flex items-center justify-center min-h-screen p-2 sm:p-4 transition-all duration-500 ease-out
                ${pdfModal.isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
              <div 
                className={`relative bg-white rounded-3xl w-full mx-2 sm:mx-4 shadow-2xl transform transition-all duration-500 ease-out overflow-hidden
                  ${isFullscreen ? 'max-w-full h-screen' : 'max-w-7xl h-[90vh]'}
                  ${pdfModal.isOpen ? 'rotate-0' : 'rotate-1'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl p-[2px] animate-gradient-x">
                  <div className="bg-white rounded-3xl h-full w-full"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Enhanced Header with glassmorphism effect - Made mobile responsive */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-slate-50/90 to-blue-50/90 backdrop-blur-lg border-b border-white/20 rounded-t-3xl">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className="relative">
                        <div className={`rounded-full p-2 sm:p-3 shadow-lg ${pdfModal.type === 'Activity Report' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                          {pdfModal.type === 'Activity Report' ? 
                            <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> : 
                            <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                          }
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="max-w-[200px] sm:max-w-none">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                          {pdfModal.title}
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            PDF
                          </span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {pdfModal.type} • Interactive Viewer
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons - Made mobile responsive */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 w-full sm:w-auto">
                      <button
                        onClick={toggleFullscreen}
                        className="group p-2 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? 
                          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" /> : 
                          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        }
                      </button>
                      <a
                        href={pdfModal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      </a>
                      <a
                        href={pdfModal.url}
                        download
                        className="group p-2 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-green-600 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      </a>
                      <button 
                        onClick={closePdfModal}
                        className="group p-2 rounded-xl bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
                        title="Close"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Content Area */}
                  <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-white">
                    {/* Enhanced Loading State */}
                    {pdfLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center space-y-6">
                          {/* Animated Logo */}
                          <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
                            </div>
                          </div>
                          
                          {/* Loading Text with Typewriter Effect */}
                          <div className="text-center">
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 animate-pulse">
                              Loading your document...
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Please wait while we prepare your PDF
                            </p>
                            <div className="mt-4 flex justify-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Error State */}
                    {pdfError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                        <div className="text-center space-y-6 p-4 sm:p-8 max-w-md">
                          <div className="relative">
                            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto flex items-center justify-center shadow-lg">
                              <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
                            </div>
                            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                              Oops! Something went wrong
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                              We couldn't load the PDF in our viewer, but don't worry! 
                              You can still access your document using the options below.
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                            <a
                              href={pdfModal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
                            >
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Open in New Tab
                            </a>
                            <a
                              href={pdfModal.url}
                              download
                              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
                            >
                              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Download PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PDF Viewer */}
                    {!pdfError && (
                      <iframe 
                        src={getViewerUrl(pdfModal.url)}
                        className="w-full h-full border-0 rounded-b-3xl"
                        title="PDF Document"
                        onLoad={handlePdfLoad}
                        onError={handlePdfError}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Custom CSS */}
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6, #1E40AF, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        @media (max-width: 640px) {
          .xs\\:w-20 { width: 5rem; }
          .xs\\:h-20 { height: 5rem; }
          .xs\\:w-24 { width: 6rem; }
          .xs\\:h-24 { height: 6rem; }
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #1e40af);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #1d4ed8);
        }
      `}</style>
    </section>
  );
};

export default AboutUs;