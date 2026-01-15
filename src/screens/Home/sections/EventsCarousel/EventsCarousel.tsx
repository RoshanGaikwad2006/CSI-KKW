
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/router";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

type Event = {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "upcoming" | "ongoing" | "past";
};

const DESCRIPTION_LIMIT = 120;

const staticEvents: Event[] = [
  {
    id: 7,
    title: "E-Yantran 2026",
    description:
      "Largest E-Waste Awareness & Collection Mega Drive. Volunteer registrations are open",
    image: "/images/eyantran.png",
    status: "upcoming",
  },
  {
    id: 1,
    title: "CSI Installation Ceremony",
    description:
      "Installation for the new board members of the CSI KKWIEER for academic year 2025-26.",
    image: "/images/installation.jpg",
    status: "past",
  },
  {
    id: 2,
    title: "Google Cohort Programme",
    description:
      "Cohort 2 Guidance Sessions, aimed at introducing students to cloud learning opportunities",
    image: "/images/cohort.jpg",
    status: "past",
  },
  {
    id: 6,
    title: "Campus to Corporate 4.0",
    description:
      "Take the leap from learning to career readiness! Gain real-world experience, expert mentorship, and certificates that set you apart.",
    image: "/images/c2c.png",
    status: "past",
  }
];

export const EventsCarousel = (): JSX.Element => {
  const router = useRouter();

  const displayEvents = staticEvents;

  const truncateDescription = (text: string) => {
    if (text.length <= DESCRIPTION_LIMIT) return text;
    return text.substring(0, DESCRIPTION_LIMIT) + "...more";
  };

  return (
    <section className="relative w-full py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-transparent">
      {/* Section heading */}
      <div className="relative z-10 text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
          Think. Build. Compete
        </h1>
        <p className="text-base sm:text-lg text-gray-800 mt-2">
          Recent Events
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={false}
        pagination={{ clickable: true }}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={3000}
        loop={true}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="max-w-7xl mx-auto px-2 sm:px-4 mb-8"
      >
        {displayEvents.map((event) => (
          <SwiperSlide key={event.id}>
            <Card className="p-4 sm:p-6 shadow-xl rounded-2xl bg-white/80 backdrop-blur-lg border border-white/200 h-[500px] sm:h-[520px] flex flex-col">
              {/* Event Image */}
              <div className="relative w-full h-[160px] sm:h-[180px] lg:h-[220px] overflow-hidden rounded-xl shadow-md">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-center"
                />
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-md shadow-md tracking-wide
                    ${
                      event.status === "upcoming"
                        ? "bg-blue-100 text-blue-600"
                        : event.status === "ongoing"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-800 text-white"
                    }`}
                >
                  {event.status.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 mt-3">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                  {event.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                  {truncateDescription(event.description)}
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow hover:opacity-90 transition text-sm sm:text-base px-4 sm:px-6 py-2"
                  onClick={() => router.push(`/events/`)}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* View All Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push("/events")}
          className="
            relative
            px-6 sm:px-8 py-2 sm:py-3
            bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600
            text-white
            font-semibold
            rounded-lg
            shadow-lg
            overflow-hidden
            group
            transition-all
            duration-300
            ease-in-out
            hover:scale-105
          "
        >
          
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>

          {/* Moving background stripe on hover */}
          <span className="absolute -left-8 top-0 w-24 h-full bg-white/20 rounded-full transform rotate-45 translate-x-0 group-hover:translate-x-[200%] transition-transform duration-700"></span>

          {/* Button text */}
          <span className="relative z-10 tracking-wider text-base sm:text-lg group-hover:scale-105 transition-transform duration-300">
            View All
          </span>
        </button>
      </div>
    </section>
  );
};