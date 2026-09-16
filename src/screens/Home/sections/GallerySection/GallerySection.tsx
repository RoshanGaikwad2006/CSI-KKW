import React, { useState } from "react";
import { X, ArrowRight, ExternalLink, Calendar, Users, MapPin } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

export interface MomentPhoto {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
}

export const momentsData: MomentPhoto[] = [
  {
    id: 1,
    src: "/images/installation.jpg",
    title: "CSI Installation Ceremony",
    category: "Ceremony",
    date: "August 2025",
  },
  {
    id: 2,
    src: "/images/cohort.jpg",
    title: "Google Cloud Cohort",
    category: "Workshop",
    date: "August 2025",
  },
  {
    id: 3,
    src: "/images/csi_img1.png",
    title: "National Student Convention",
    category: "Convention",
    date: "December 2024",
  },
  {
    id: 4,
    src: "/images/pc.jpg",
    title: "Professional Connect Meet",
    category: "Networking",
    date: "July 2025",
  },
];

export const GallerySection: React.FC = () => {
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState<MomentPhoto | null>(null);

  const openModal = (photo: MomentPhoto) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "unset";
  };

  return (
    <section id="gallery-section" className="w-full py-14 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
              Moments That Matter
            </h2>
            <div className="w-10 h-1 bg-[#1D68F2] rounded-full mt-1" />
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D68F2] hover:text-blue-700 transition-colors group"
          >
            <span>View Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Moments Grid (4 photo cards + 1 'More Moments' card) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {momentsData.map((photo) => (
            <div
              key={photo.id}
              onClick={() => openModal(photo)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/3] sm:aspect-[3/4] flex flex-col justify-end"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Caption */}
              <div className="relative p-3.5 sm:p-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block mb-0.5">
                  {photo.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold leading-tight line-clamp-2">
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}

          {/* 5th Card: "+ 100+ More Moments" (Matches reference) */}
          <div
            onClick={() => router.push("/gallery")}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-blue-50/40 border border-blue-100 hover:border-blue-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 aspect-[4/3] sm:aspect-[3/4]"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1D68F2] tracking-tight">
                + 100+
              </div>
              <div className="text-sm font-bold text-[#0A192F] mt-1">
                More Moments
              </div>
              <p className="text-xs text-slate-500 mt-2 hidden sm:block">
                Explore our full photo archive of events, competitions, and installations.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-10 h-10 rounded-full border border-blue-200 bg-white group-hover:bg-[#1D68F2] text-[#1D68F2] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-slate-900">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#1D68F2]">
                  {selectedPhoto.category} • {selectedPhoto.date}
                </span>
                <h3 className="text-xl font-bold text-[#0A192F] mt-0.5">
                  {selectedPhoto.title}
                </h3>
              </div>

              <button
                onClick={() => router.push("/gallery")}
                className="bg-[#1D68F2] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-4 py-2 transition-colors"
              >
                View in Full Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
