export interface EventItem {
  id: string | number;
  title: string;
  subtitle?: string;
  category: "all" | "workshops" | "talks" | "hackathons" | "competitions" | "community" | "webinars" | "upcoming";
  categoryBadge: string;
  dateBadge: {
    day: string | number;
    month: string;
    year?: string | number;
  };
  dateRange: string;
  time: string;
  location: string;
  venueFull?: string;
  description: string;
  image: string;
  attendees?: number | string | null;
  expectedAttendees?: string;
  featured?: boolean;
  registrationClosed?: boolean;
  tags?: string[];
  whatToExpect?: {
    title: string;
    desc: string;
    icon: "sessions" | "drive" | "talks" | "cert";
  }[];
}

export const eventsData: EventItem[] = [
  {
    id: "vision-week-2026",
    title: "Vision Week 2026",
    subtitle: "Smarter Skills, Brighter Career • Explore • Create • Work Smarter",
    category: "upcoming",
    categoryBadge: "UPCOMING",
    dateBadge: {
      month: "SEP",
      day: "26",
      year: "2026",
    },
    dateRange: "Sep 26 – 30, 2026",
    time: "Online Sessions",
    location: "Online Sessions",
    venueFull: "Online Google Meet Sessions (CSI KKWIEER)",
    description:
      "Join us for Vision Week 2026 organized by CSI Students' Chapter Nashik 2026-27 at K. K. Wagh Institute of Engineering Education & Research. A transformative 5-day online conclave featuring: Day 1 AI Tools (26/09), Day 2 SIH Session (27/09), Day 3 Placement Roadmap (28/09), Day 4 Expert Session (29/09), and Day 5 Higher Studies (30/09). Registration Fee: ₹50.",
    image: "/images/vision-week-cover.png",
    attendees: null,
    expectedAttendees: "500+ Registered Students",
    featured: true,
    registrationClosed: false,
    tags: ["Vision Week", "AI Tools", "SIH", "Placement Roadmap", "Higher Studies", "Flagship"],
    whatToExpect: [
      {
        title: "Day 1: AI Tools (26/09/2026)",
        desc: "Hands-on exposure to modern generative AI, developer tools & smart productivity workflows.",
        icon: "sessions",
      },
      {
        title: "Day 2: SIH Session (27/09/2026)",
        desc: "Smart India Hackathon problem statements, ideation, team formation & winning hackathon strategies.",
        icon: "talks",
      },
      {
        title: "Day 3: Placement Roadmap (28/09/2026)",
        desc: "Comprehensive roadmap for campus drives, resume building, interview prep & core tech competencies.",
        icon: "drive",
      },
      {
        title: "Day 4: Expert Session (29/09/2026)",
        desc: "Exclusive interactive session with industry leaders and technical experts sharing industry vision.",
        icon: "talks",
      },
      {
        title: "Day 5: Higher Studies (30/09/2026)",
        desc: "Comprehensive guidance on GATE, GRE, CAT, higher education opportunities & research paths.",
        icon: "cert",
      },
    ],
  },
  {
    id: "expert-talk-2026",
    title: "Global IT Careers 2027+",
    subtitle: "Expert Session by Dr. Deepak Shikarpur",
    category: "talks",
    categoryBadge: "EXPERT TALK",
    dateBadge: {
      month: "SEP",
      day: "8",
      year: "2026",
    },
    dateRange: "Sep 8, 2026",
    time: "2:30 PM – 4:00 PM",
    location: "JVN Hall, KKWIEER",
    venueFull: "JVN Hall, Computer Engineering Department, KKWIEER",
    description:
      "Enlightening expert session on Global IT Careers 2027+, emerging industry expectations, modern tech stacks, and career roadmaps delivered by distinguished IT industry veteran and author Dr. Deepak Shikarpur.",
    image: "https://files.catbox.moe/smyr5w.jpg",
    attendees: 120,
    expectedAttendees: "120 Attendees",
    featured: true,
    registrationClosed: true,
    tags: ["Career Guidance", "IT Industry", "Future of Tech", "Expert Session"],
    whatToExpect: [
      {
        title: "Industry Vision 2027+",
        desc: "Navigating AI disruption, cloud adoption, and future engineering roles.",
        icon: "talks",
      },
      {
        title: "Skill Mapping",
        desc: "Crucial core competencies and frameworks demanded by top global tech firms.",
        icon: "sessions",
      },
      {
        title: "Interactive Q&A",
        desc: "Live dialogue with Dr. Deepak Shikarpur addressing student aspirations.",
        icon: "drive",
      },
      {
        title: "Certificate of Participation",
        desc: "Official CSI KKWIEER seminar participation e-certificates.",
        icon: "cert",
      },
    ],
  },
  {
    id: "installation-2026",
    title: "CSI Installation Ceremony 2026",
    subtitle: "Official Committee Induction Ceremony 2026",
    category: "community",
    categoryBadge: "CEREMONY",
    dateBadge: {
      month: "AUG",
      day: "18",
      year: "2026",
    },
    dateRange: "Aug 18, 2026",
    time: "01:00 PM – 5:00 PM",
    location: "JVN Hall, KKWIEER",
    venueFull: "Sir Dr. M. S. Gosavi Seminar Hall (JVN Hall), KKWIEER",
    description:
      "Official Installation Ceremony of the CSI KKWIEER Student Branch Committee 2026. Welcoming our enthusiastic new student leadership, presenting badges, and ushering in an inspiring year of tech innovation and student growth.",
    image: "https://files.catbox.moe/5yzddm.jpg",
    attendees: 45,
    expectedAttendees: "45 Attendees",
    featured: true,
    registrationClosed: true,
    tags: ["Installation", "Leadership", "Ceremony", "CSI Committee"],
    whatToExpect: [
      {
        title: "Badge Induction",
        desc: "Honoring incoming office bearers and committee heads.",
        icon: "cert",
      },
      {
        title: "Address by Dignitaries",
        desc: "Inspiring speeches by faculty advisors and chapter heads.",
        icon: "talks",
      },
      {
        title: "Annual Roadmap",
        desc: "Unveiling technical events, hackathons, and workshops planned for 2026.",
        icon: "sessions",
      },
      {
        title: "Networking & Felicitations",
        desc: "Celebrating past achievements and welcoming new leaders.",
        icon: "drive",
      },
    ],
  },
  {
    id: "e-yantran-2026",
    title: "E-Yantran 2026",
    subtitle: "Largest E-Waste Awareness & Collection Mega Drive",
    category: "community",
    categoryBadge: "AWARENESS",
    dateBadge: {
      month: "JAN",
      day: "20",
      year: "2026",
    },
    dateRange: "Jan 20 – 23, 2026",
    time: "9:00 AM",
    location: "Campus Wide",
    venueFull: "KKWIEER Campus, Nashik, Maharashtra",
    description:
      "Largest E-Waste Awareness & Collection Mega Drive. Volunteer registrations are closed. A flagship initiative driving change through responsible electronics recycling, empowering communities for a sustainable future.",
    image: "/images/Eyantran2026.jpeg",
    attendees: 50,
    expectedAttendees: "50 Attendees",
    featured: true,
    registrationClosed: true,
    tags: ["Sustainability", "E-Waste", "Environment", "Community"],
    whatToExpect: [
      {
        title: "Awareness Sessions",
        desc: "Learn about e-waste impact, hazardous components, and recycling methods.",
        icon: "sessions",
      },
      {
        title: "Collection Drive",
        desc: "On-campus designated collection drop-off points for dead electronics.",
        icon: "drive",
      },
      {
        title: "Expert Talks",
        desc: "Hear industry and environmental sustainability experts share insights.",
        icon: "talks",
      },
      {
        title: "Certificates",
        desc: "Official CSI KKWIEER activity e-certificates for all registered participants.",
        icon: "cert",
      },
    ],
  },
  {
    id: "campus-to-corporate-4",
    title: "Campus to Corporate 4.0",
    subtitle: "Career Readiness & Industry Transition",
    category: "workshops",
    categoryBadge: "BOOTCAMP",
    dateBadge: {
      month: "SEP",
      day: "28",
      year: "2025",
    },
    dateRange: "Sep 28, 2025",
    time: "9:00 AM",
    location: "Multiple Labs",
    venueFull: "Department of Computer Engineering - Multiple Labs, KKWIEER",
    description:
      "Take the leap from learning to career readiness! Gain real-world experience, expert mentorship, and certificates that set you apart.",
    image: "/images/c2c.png",
    attendees: 150,
    expectedAttendees: "150 Attendees",
    featured: false,
    registrationClosed: true,
    tags: ["Career Readiness", "Placements", "Mentorship", "Industry"],
    whatToExpect: [
      {
        title: "Technical Mock Rounds",
        desc: "Hands-on coding, algorithmic assessments, and system design interviews.",
        icon: "sessions",
      },
      {
        title: "HR & Aptitude Guidance",
        desc: "Corporate communication, behavioral questions, and resume workshops.",
        icon: "talks",
      },
      {
        title: "Industry Mentors",
        desc: "Direct feedback and coaching from software engineers at top firms.",
        icon: "drive",
      },
      {
        title: "Bootcamp Certificate",
        desc: "Verified completion certificate endorsing professional readiness.",
        icon: "cert",
      },
    ],
  },
  {
    id: "installation-2025",
    title: "CSI Installation Ceremony",
    subtitle: "Installation Ceremony for Academic Year 2025-26",
    category: "community",
    categoryBadge: "CEREMONY",
    dateBadge: {
      month: "AUG",
      day: "11",
      year: "2025",
    },
    dateRange: "Aug 11, 2025",
    time: "01:00 PM - 5:00 PM",
    location: "JVN Hall",
    venueFull: "Sir Dr. M. S. Gosavi Seminar Hall (JVN Hall), KKWIEER",
    description:
      "Installation for the new board members of the CSI KKWIEER for academic year 2025-26. Every ending writes a new beginning, together we carry the legacy ahead.",
    image: "/images/installation.jpg",
    attendees: 45,
    expectedAttendees: "45 Attendees",
    featured: false,
    registrationClosed: true,
    tags: ["Ceremony", "Leadership", "CSI Committee", "Legacy"],
    whatToExpect: [
      {
        title: "Board Induction",
        desc: "Formal introduction of executive committee members.",
        icon: "cert",
      },
      {
        title: "Keynote Address",
        desc: "Speeches by faculty advisors on technological leadership.",
        icon: "talks",
      },
      {
        title: "Chapter Highlights",
        desc: "Review of achievements and upcoming initiatives.",
        icon: "sessions",
      },
      {
        title: "Networking",
        desc: "Interaction between students, alumni, and faculty.",
        icon: "drive",
      },
    ],
  },
  {
    id: "google-cohort-programme",
    title: "Google Cohort Programme",
    subtitle: "Google Cloud Arcade Facilitator Program",
    category: "talks",
    categoryBadge: "FACILITATOR",
    dateBadge: {
      month: "AUG",
      day: "5",
      year: "2025",
    },
    dateRange: "Aug 5, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "JVN Hall",
    venueFull: "JVN Hall, Computer Engineering Department, KKWIEER",
    description:
      "Cohort 2 Guidance Sessions, aimed at introducing students to cloud learning opportunities, gamified upskilling, and community building.",
    image: "/images/cohort.jpg",
    attendees: 120,
    expectedAttendees: "120 Attendees",
    featured: false,
    registrationClosed: true,
    tags: ["Google Cloud", "Arcade", "Cloud Computing", "Upskilling"],
    whatToExpect: [
      {
        title: "Cloud Fundamentals",
        desc: "Introduction to Google Cloud Platform tools and architecture.",
        icon: "sessions",
      },
      {
        title: "Arcade Milestone Roadmap",
        desc: "Guidance on earning skill badges and redeeming rewards.",
        icon: "drive",
      },
      {
        title: "Hands-on Demos",
        desc: "Live walkthrough of interactive cloud labs and quests.",
        icon: "talks",
      },
      {
        title: "Facilitator Support",
        desc: "Dedicated peer mentors assisting participants throughout.",
        icon: "cert",
      },
    ],
  },
  {
    id: "campus-to-corporate-3",
    title: "Campus To Corporate 3.0",
    subtitle: "Corporate Readiness & Career Insights",
    category: "competitions",
    categoryBadge: "WORKSHOP",
    dateBadge: {
      month: "MAR",
      day: "17",
      year: "2025",
    },
    dateRange: "Mar 17, 2025",
    time: "9:00 AM",
    location: "Multiple Labs",
    venueFull: "Multiple Labs, Department of Computer Engineering, KKWIEER",
    description:
      "Campus to Corporate was a powerful-packed session filled with industry trends, career insights, and practical tips to help students transition from academic life to the corporate world with confidence.",
    image: "/images/c2c.jpg",
    attendees: 180,
    expectedAttendees: "180 Attendees",
    featured: false,
    registrationClosed: true,
    tags: ["Career Insights", "Corporate Trends", "Mentorship", "Confidence"],
    whatToExpect: [
      {
        title: "Industry Trends",
        desc: "Insights into hiring shifts and modern tech workplace expectations.",
        icon: "talks",
      },
      {
        title: "Interactive Coding",
        desc: "Practical technical problem-solving exercises.",
        icon: "sessions",
      },
      {
        title: "Interview Strategies",
        desc: "Tips on cracking corporate interviews and group discussions.",
        icon: "drive",
      },
      {
        title: "Participation Certificate",
        desc: "Official CSI KKWIEER workshop certificates.",
        icon: "cert",
      },
    ],
  },
  {
    id: "e-yantran-2024-25",
    title: "E-Yantran 2024-25",
    subtitle: "Turn Your Trash into Treasure",
    category: "workshops",
    categoryBadge: "AWARENESS",
    dateBadge: {
      month: "JAN",
      day: "28",
      year: "2025",
    },
    dateRange: "Jan 28, 2025",
    time: "9:00 AM",
    location: "Multiple Labs",
    venueFull: "Multiple Labs & Central Campus Collection Centers, KKWIEER",
    description:
      "Turn your trash into Treasure is what we followed in E-Yantran 2025. A flagship initiative, driving change through E-Waste awareness and collection, empowering communities for a sustainable future.",
    image: "/images/eyantran.jpg",
    attendees: 32,
    expectedAttendees: "32 Attendees",
    featured: false,
    registrationClosed: true,
    tags: ["E-Waste", "Sustainability", "Awareness", "Community Drive"],
    whatToExpect: [
      {
        title: "Collection Booths",
        desc: "Safe collection of unwanted electronics and appliances.",
        icon: "drive",
      },
      {
        title: "Awareness Campaign",
        desc: "Educating students on hazardous metals and responsible disposal.",
        icon: "talks",
      },
      {
        title: "Eco Contribution",
        desc: "Handing over collected e-waste to certified recyclers.",
        icon: "sessions",
      },
      {
        title: "Recognition Badges",
        desc: "Acknowledging active environmental contributors.",
        icon: "cert",
      },
    ],
  },
];
