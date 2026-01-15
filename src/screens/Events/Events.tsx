import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import { Navbar } from "../../components/ui/navbar";
import { useRouter } from "next/router";

const Events = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  const [activeCategory, setActiveCategory] = useState("all");

  const events = [
    {
      id: 7,
      title: "E-Yantran 2026",
      category: "upcoming",
      date: "2026-01-20",
      time: "9:00 AM",
      location: "Campus Wide",
      description:
        "Largest E-Waste Awareness & Collection Mega Drive. Volunteer registrations are open",
      image: "/images/Eyantran2026.jpeg",
      attendees: null,
      featured: true,
    },
    {
      id: 6,
      title: "Campus to Corporate 4.0",
      category: "competitions",
      date: "2025-09-28",
      time: "9:00 AM",
      location: "Multiple Labs",
      description:
        "Take the leap from learning to career readiness! Gain real-world experience, expert mentorship, and certificates that set you apart.",
      image: "/images/c2c.png",
      attendees: 150,
      featured: false,
    },
    {
      id: 1,
      title: "CSI Installation Ceremony",
      category: "all",
      date: "2025-08-11",
      time: "01:00 PM - 5:00 PM",
      location: "JVN Hall",
      description:
        "Installation for the new board members of the CSI KKWIEER for academic year 2025-26.",
      image: "/images/installation.jpg",
      attendees: 45,
    },
    {
      id: 2,
      title: "Google Cohort Programme",
      category: "talks",
      date: "2025-08-05",
      time: "10:00 AM - 12:00 PM",
      location: "JVN Hall",
      description:
        "Cohort 2 Guidance Sessions, aimed at introducing students to cloud learning opportunities",
      image: "/images/cohort.jpg",
      attendees: 120,
      featured: false,
    },
    {
      id: 3,
      title: "Campus To Corporate 3.0",
      category: "competitions",
      date: "2025-03-17",
      time: "9:00 AM",
      location: "Multiple Labs",
      description:
        "Campus to Corporate was a powerful-packed session filled with industry trends, career insights, and practical tips to help students transition from academic life to the corporate world with confidence.",
      image: "/images/c2c.jpg",
      attendees: 180,
    },
    {
      id: 4,
      title: "E-Yantran 2024-25",
      category: "workshops",
      date: "2025-01-28",
      time: "9:00 AM",
      location: "Multiple Labs",
      description:
        "Turn your trash into Treasure is what we followed in E-Yantran 2025. A flagship initiative, driving change through E-Waste awareness and collection, empowering communities for a sustainable future.",
      image: "/images/eyantran.jpg",
      attendees: 32,
      featured: false,
    },
    
  ];

  const categories = [
    {
      id: "upcoming",
      name: "Upcoming",
      count: events.filter((e) => new Date(e.date) > new Date()).length,
    },
    { id: "all", name: "All Events", count: events.length },
    {
      id: "talks",
      name: "Talks",
      count: events.filter((e) => e.category === "talks").length,
    },
    {
      id: "competitions",
      name: "Competitions",
      count: events.filter((e) => e.category === "competitions").length,
    },
    {
      id: "workshops",
      name: "Workshops",
      count: events.filter((e) => e.category === "workshops").length,
    },
  ];

  const filteredEvents =
  activeCategory === "all"
    ? events
    : activeCategory === "upcoming"
      ? events.filter((event) => event.category === "upcoming")
      : events.filter((event) => event.category === activeCategory);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
    };
  };

  const truncate = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-800 opacity-100"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-white py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 mt-20 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            CSI Events
          </h1>
          <p className="text-xl md:text-2xl opacity-90 font-light mb-8">
            Discover • Learn • Compete • Connect
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 -mt-12 pb-20">
        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/80 p-2 mb-10">
          <div className="flex justify-center gap-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2 min-w-[120px] rounded-xl font-semibold text-sm justify-center border border-gray-600 bg-transparent transition-colors duration-300 ${activeCategory === cat.id
                  ? "border-blue-500 text-blue-600"
                  : "text-gray-700 hover:border-blue-500 hover:text-blue-600"
                  }`}
              >
                {cat.id === "talks" && <Calendar className="w-4 h-4" />}
                {cat.id === "workshops" && <Sparkles className="w-4 h-4" />}
                {cat.id === "competitions" && <Award className="w-4 h-4" />}
                <span>{cat.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${activeCategory === cat.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`group relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between border border-white/20 ${event.featured ? "ring-2 ring-indigo-200 ring-offset-2" : ""
                }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-3">
                      {truncate(event.description, 100)}
                    </p>
                  </div>

                  {/* Date Box */}
                  <div className="ml-4 bg-white border border-gray-800 rounded-xl p-3 text-center shadow-md w-16">
                    <div className="text-xl font-bold text-gray-900">
                      {formatDate(event.date).day}
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                      {formatDate(event.date).month}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm gap-2">
                    <div className="flex items-center gap-2 rounded-lg px-3 py-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm gap-2">
                    <div className="flex items-center gap-2 rounded-lg px-3 py-1">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium truncate">
                        {event.location}
                      </span>
                    </div>
                  </div>
                  {event.attendees && (
                    <div className="flex items-center text-sm gap-2">
                      <div className="flex items-center gap-2 rounded-lg px-3 py-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{event.attendees} Attendees</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Register / Read More Button */}
                {event.category === "upcoming" && (
                  <button
                    className="mt-6 w-full py-3 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 
    border border-gray-600 bg-transparent text-blue-600 
    transition-colors duration-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                    onClick={()=>window.open("https://forms.gle/wKDSxzc9jmQknyBS7", "_blank")}
                  >
                    Register Now
                  </button>
                )}


              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-500">
              Check back soon for exciting new events in this category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;