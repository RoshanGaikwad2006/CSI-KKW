import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Navbar } from "../../components/ui/navbar";
import { FooterSection } from "../Home/sections/FooterSection";
import {
    X,
    Search,
    Filter,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Calendar,
    Tag,
    Eye,
    Sparkles,
    Grid3X3,
    List,
    Users,
    MapPin,
    ArrowLeft,
    Play
} from "lucide-react";
import { useRouter } from "next/router";

type EventPhoto = {
    id: number;
    src: string;
    title: string;
    eventId: string;
    eventName: string;
    date: string;
    category: string;
    description?: string;
};

type Event = {
    id: string;
    name: string;
    date: string;
    location: string;
    category: string;
    description: string;
    coverImage: string;
    photoCount: number;
    participants?: number;
};

const EVENTS: Event[] = [
    {
        id: "installation-2026",
        name: "CSI Installation Ceremony 2026",
        date: "August 2026",
        location: "K. K. Wagh Campus",
        category: "Ceremony",
        description: "Official Installation Ceremony of the CSI KKWIEER Student Branch Committee 2026",
        coverImage: "https://files.catbox.moe/5yzddm.jpg",
        photoCount: 10,
        participants: 35
    },
    {
        id: "expert-talk-2026",
        name: "Global IT Careers 2027+ by Dr. Deepak Shikarpur",
        date: "September 2026",
        location: "K. K. Wagh Campus",
        category: "Seminar",
        description: "Enlightening Expert Session on Future IT Careers, Skills & Industry Expectations by Dr. Deepak Shikarpur",
        coverImage: "https://files.catbox.moe/smyr5w.jpg",
        photoCount: 7,
        participants: 120
    },
    {
        id: "installation-2025",
        name: "CSI Installation Ceremony 2025",
        date: "March 2025",
        location: "",
        category: "Ceremony",
        description: "",
        coverImage: "/images/installation.jpg",
        photoCount: 15
    },
    {
        id: "google-cohort",
        name: "Google Cohort Programme",
        date: "April 2025",
        location: "",
        category: "Workshop",
        description: "",
        coverImage: "/images/cohort.jpg",
        photoCount: 8,
    },
    {
        id: "c2c-seminar",
        name: "Campus To Corporate",
        date: "May 2025",
        location: "",
        category: "Seminar",
        description: "",
        coverImage: "/images/c2c.jpg",
        photoCount: 12
    },
    {
        id: "eyantran-2024",
        name: "E-Yantran 2024-25",
        date: "January 2025",
        location: "",
        category: "Activity",
        description: "",
        coverImage: "/images/eyantran.jpg",
        photoCount: 6
    },
    {
        id: "eyantran-2026",
        name: "E-Yantran 2026",
        date: "20th Jan 2026 - 23rd Jan 2026",
        location: "Campus Wide",
        category: "Activity",
        description: "Largest E-Waste Awareness & Collection Mega Drive",
        coverImage: "/images/Eyantran2026.jpeg",
        photoCount: 1
    },
    {
        id: "professional-connect",
        name: "Professional Connect",
        date: "July 2025",
        location: "",
        category: "Networking",
        description: "",
        coverImage: "/images/pc.jpg",
        photoCount: 10,
    },
    {
        id: "awards-2018",
        name: "Best Student Branch Award",
        date: "December 2018",
        location: "",
        category: "Award",
        description: "",
        coverImage: "/images/csi_img1.png",
        photoCount: 5,
    },
    {
        id: "counselor-award",
        name: "Counselor Award",
        date: "December 2015",
        location: "",
        category: "Award",
        description: "",
        coverImage: "/images/csi_img2.png",
        photoCount: 3,
    }
];

const EVENT_PHOTOS: EventPhoto[] = [
    // Installation Ceremony 2026 photos (CDN hosted)
    { id: 101, src: "https://files.catbox.moe/5yzddm.jpg", title: "CSI Installation Ceremony 2026", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 102, src: "https://files.catbox.moe/1cbcbg.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 103, src: "https://files.catbox.moe/99xooy.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 104, src: "https://files.catbox.moe/38ltho.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 105, src: "https://files.catbox.moe/eo58il.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 106, src: "https://files.catbox.moe/szde06.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 107, src: "https://files.catbox.moe/pswped.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 109, src: "https://files.catbox.moe/6edfo8.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 111, src: "https://files.catbox.moe/2n37td.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },
    { id: 113, src: "https://files.catbox.moe/n52qc0.jpg", title: "", eventId: "installation-2026", eventName: "CSI Installation Ceremony 2026", date: "August 2026", category: "Ceremony" },

    // Expert Talk 2026 photos (CDN hosted)
    { id: 201, src: "https://files.catbox.moe/smyr5w.jpg", title: "Global IT Careers 2027+ by Dr. Deepak Shikarpur", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 202, src: "https://files.catbox.moe/122fhw.jpeg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 203, src: "https://files.catbox.moe/lfyvzh.jpeg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 204, src: "https://files.catbox.moe/1ra3t1.jpeg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 205, src: "https://files.catbox.moe/xtgo0e.jpeg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 206, src: "https://files.catbox.moe/894dve.jpg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },
    { id: 207, src: "https://files.catbox.moe/gjlvra.jpg", title: "", eventId: "expert-talk-2026", eventName: "Global IT Careers 2027+", date: "September 2026", category: "Seminar" },

    // Previous Installation Ceremony photos
    { id: 1, src: "/images/installation.jpg", title: "Installation Ceremony", eventId: "installation-2025", eventName: "CSI Installation Ceremony", date: "March 2025", category: "Ceremony" },
    { id: 2, src: "/images/installation.jpg", title: "Award Presentation", eventId: "installation-2025", eventName: "CSI Installation Ceremony", date: "March 2025", category: "Ceremony" },
    { id: 3, src: "/images/installation.jpg", title: "Committee Members", eventId: "installation-2025", eventName: "CSI Installation Ceremony", date: "March 2025", category: "Ceremony" },

    // Google Cohort photos
    { id: 4, src: "/images/cohort.jpg", title: "Google Cloud Workshop", eventId: "google-cohort", eventName: "Google Cohort Programme", date: "April 2025", category: "Workshop" },
    { id: 5, src: "/images/cohort.jpg", title: "Hands-on Learning", eventId: "google-cohort", eventName: "Google Cohort Programme", date: "April 2025", category: "Workshop" },

    // C2C Seminar photos
    { id: 6, src: "/images/c2c.jpg", title: "Career Guidance Session", eventId: "c2c-seminar", eventName: "Campus To Corporate", date: "May 2025", category: "Seminar" },
    { id: 7, src: "/images/c2c.jpg", title: "Industry Expert Talk", eventId: "c2c-seminar", eventName: "Campus To Corporate", date: "May 2025", category: "Seminar" },

    // E-Yantran photos
    { id: 8, src: "/images/eyantran.jpg", title: "E-Waste Collection", eventId: "eyantran", eventName: "E-Yantran Initiative", date: "June 2025", category: "Activity" },

    // Professional Connect photos
    { id: 9, src: "/images/pc.jpg", title: "Networking Event", eventId: "professional-connect", eventName: "Professional Connect", date: "July 2025", category: "Networking" },

    // Award photos
    { id: 10, src: "/images/csi_img1.png", title: "Best Student Branch Award", eventId: "awards-2018", eventName: "Best Student Branch Award", date: "December 2018", category: "Award" },
    { id: 11, src: "/images/csi_img2.png", title: "Counselor Award", eventId: "counselor-award", eventName: "Counselor Award", date: "December 2015", category: "Award" }
];

const CATEGORIES = ["All", "Workshop", "Seminar", "Ceremony", "Networking", "Activity", "Award"] as const;

const Gallery = (): JSX.Element => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [router.pathname]);

    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
    const [events] = useState<Event[]>(EVENTS);
    const [eventPhotos] = useState<EventPhoto[]>(EVENT_PHOTOS);

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showTop, setShowTop] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentView, setCurrentView] = useState<'events' | 'photos'>('events');

    const filteredEvents = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = events.filter((event) => {
            const matchesCategory = activeCategory === "All" || event.category === activeCategory;
            if (!q) return matchesCategory;
            const hay = `${event.name} ${event.description} ${event.location} ${event.category}`.toLowerCase();
            return matchesCategory && hay.includes(q);
        });
        return filtered;
    }, [events, query, activeCategory]);

    const filteredPhotos = useMemo(() => {
        if (!selectedEvent) return [];
        return eventPhotos.filter(photo => photo.eventId === selectedEvent.id);
    }, [eventPhotos, selectedEvent]);

    // Skip loading animation
    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % filteredPhotos.length));
            if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + filteredPhotos.length) % filteredPhotos.length));
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxIndex, filteredPhotos.length]);
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [lightboxIndex]);


    useEffect(() => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>(".js-reveal"));
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        setTimeout(() => {
                            el.style.transition = "all 800ms cubic-bezier(0.16, 1, 0.3, 1)";
                            el.style.transform = "translateY(0) scale(1) rotateX(0)";
                            el.style.opacity = "1";
                            el.style.filter = "blur(0px)";
                        }, index * 50);
                        obs.unobserve(el);
                    }
                });
            },
            { threshold: 0.1 }
        );
        elements.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [filteredEvents, filteredPhotos]);


    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateY = ((x - midX) / midX) * 5;
        const rotateX = -((y - midY) / midY) * 5;
        card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)";
    };

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const next = () => setLightboxIndex((i) => (i === null ? i : (i + 1) % filteredPhotos.length));
    const prev = () => setLightboxIndex((i) => (i === null ? i : (i - 1 + filteredPhotos.length) % filteredPhotos.length));

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setCurrentView('photos');
    };

    const handleBackToEvents = () => {
        setCurrentView('events');
        setSelectedEvent(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={20} />
                    </div>
                    <p className="mt-4 text-blue-700 font-medium">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent relative overflow-x-hidden">
            <Navbar />

            <main className="container mx-auto mt-8 px-4 pt-32 pb-20 relative z-10">
                {/* Compact Hero Section */}
                <section className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight animate-fadeInUp leading-tight">
                        Moments that define{" "}
                        <span className="text-[#1D68F2]">
                            our community
                        </span>
                    </h1>

                    <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-400">
                        Explore highlights from CSI events, workshops, and achievements.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fadeInUp delay-600">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50">
                            <Eye size={14} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">{currentView === 'events' ? filteredEvents.length : filteredPhotos.length} {currentView === 'events' ? 'Events' : 'Photos'}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50">
                            <Tag size={14} className="text-indigo-600" />
                            <span className="text-sm font-medium text-indigo-800">{CATEGORIES.length - 1} Categories</span>
                        </div>
                    </div>
                </section>

                {/* Compact Filter Section */}
                <section className="mb-8">
                    <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg p-4 animate-slideInFromTop">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            {/* Back button for photos view */}
                            {currentView === 'photos' && (
                                <button
                                    onClick={handleBackToEvents}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-300"
                                >
                                    <ArrowLeft size={16} />
                                    <span className="text-sm font-medium">Back to Events</span>
                                </button>
                            )}

                            {/* Categories */}
                            <div className="w-full lg:flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Filter size={16} className="text-blue-600" />
                                    <span className="text-sm font-medium text-slate-700">
                                        {currentView === 'events' ? 'Event Categories' : 'Photo Categories'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`group px-3 py-1.5 rounded-full text-xs border transition-all duration-300 transform hover:scale-105 ${activeCategory === cat
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-600/25"
                                                    : "bg-white/80 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/80"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search and View Mode */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={currentView === 'events' ? "Search events..." : "Search photos..."}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/90 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-md text-sm"
                                    />
                                </div>

                                <div className="flex bg-white/90 rounded-xl border border-slate-200 p-0.5 shadow-md">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        <Grid3X3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('masonry')}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'masonry'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events/Photos Gallery Section */}
                <section>
                    {currentView === 'events' ? (
                        // Events View
                        filteredEvents.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    <Search size={24} className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No events found</h3>
                                <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'masonry'
                                    ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]"
                                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            }>
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event)}
                                        className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-blue-100/50 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer js-reveal transform-gpu"
                                        style={{
                                            transform: "translateY(10px) scale(0.95)",
                                            opacity: 0,
                                            filter: "blur(3px)"
                                        }}
                                    >
                                        <div
                                            onMouseMove={handleTilt}
                                            onMouseLeave={resetTilt}
                                            className="transition-transform duration-300 will-change-transform"
                                        >
                                            <div className="relative overflow-hidden">
                                                {/* Event cover image */}
                                                <div className="aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={event.coverImage}
                                                        alt={event.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                                    />
                                                </div>

                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Category badge */}
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50">
                                                    {event.category}
                                                </div>

                                                {/* View photos button */}
                                                <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <Play size={16} className="text-white ml-0.5" />
                                                </div>

                                                {/* Photo count badge */}
                                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                                                    {event.photoCount} photos
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event details */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                                {event.name}
                                            </h3>

                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar size={12} className="text-blue-500" />
                                                    <span>{event.date}</span>
                                                </div>
                                            </div>

                                            {/* Hover indicator */}
                                            <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        // Photos View
                        filteredPhotos.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    <Search size={24} className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No photos found</h3>
                                <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'masonry'
                                    ? "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 [column-fill:_balance]"
                                    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                            }>
                                {filteredPhotos.map((photo, idx) => (
                                    <figure
                                        key={photo.id}
                                        onClick={() => openLightbox(idx)}
                                        className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl border border-blue-100/50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer js-reveal transform-gpu"
                                        style={{
                                            transform: "translateY(10px) scale(0.95)",
                                            opacity: 0,
                                            filter: "blur(3px)"
                                        }}
                                    >
                                        <div
                                            onMouseMove={handleTilt}
                                            onMouseLeave={resetTilt}
                                            className="transition-transform duration-300 will-change-transform"
                                        >
                                            <div className="relative overflow-hidden">
                                                <div className="aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={photo.src}
                                                        alt={photo.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                                    />
                                                </div>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium rounded-md border border-blue-200/50 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    {photo.category}
                                                </div>

                                                <div className="absolute top-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <ExternalLink size={12} className="text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <figcaption className="p-3">
                                            {photo.title ? (
                                                <h3 className="text-sm font-semibold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                                    {photo.title}
                                                </h3>
                                            ) : null}

                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1 text-xs text-slate-600">
                                                    <Tag size={10} className="text-blue-500" />
                                                    <span className="truncate">{photo.eventName}</span>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Calendar size={10} className="text-indigo-500" />
                                                    <span>{photo.date}</span>
                                                </div>
                                            </div>

                                            <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        )
                    )}
                </section>
            </main>

            <FooterSection />

            {/* Smaller Back to Top Button */}
            {showTop && (
                <button
                    aria-label="Back to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-[60] group"
                >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1 hover:scale-105">
                        <ChevronUp size={20} className="group-hover:animate-bounce" />
                    </div>
                </button>
            )}

            {/* Enhanced Lightbox */}
            {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="absolute inset-0" onClick={closeLightbox}></div>

                    {/* Controls */}
                    <button
                        aria-label="Close"
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 group"
                    >
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                            <X size={20} />
                        </div>
                    </button>

                    <button
                        aria-label="Previous"
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 group"
                        disabled={filteredPhotos.length <= 1}
                    >
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 disabled:opacity-50">
                            <ChevronLeft size={24} />
                        </div>
                    </button>

                    <button
                        aria-label="Next"
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 group"
                        disabled={filteredPhotos.length <= 1}
                    >
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 disabled:opacity-50">
                            <ChevronRight size={24} />
                        </div>
                    </button>

                    {/* Main content */}
                    <div className="relative max-w-5xl w-[90vw] md:w-[85vw] mx-auto">
                        <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                            <img
                                src={filteredPhotos[lightboxIndex].src}
                                alt={filteredPhotos[lightboxIndex].title}
                                className="w-full max-h-[70vh] object-contain"
                            />

                            {/* Image info */}
                            <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <div className="text-center text-white">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                                        {filteredPhotos[lightboxIndex].title || filteredPhotos[lightboxIndex].eventName}
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
                                        <div className="flex items-center gap-1">
                                            <Tag size={14} />
                                            <span>{filteredPhotos[lightboxIndex].eventName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{filteredPhotos[lightboxIndex].date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{lightboxIndex + 1} of {filteredPhotos.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }

                .animate-slideInFromTop {
                    animation: slideInFromTop 0.5s ease-out forwards;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }

                .delay-200 {
                    animation-delay: 0.2s;
                }

                .delay-400 {
                    animation-delay: 0.4s;
                }

                .delay-600 {
                    animation-delay: 0.6s;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Gallery;