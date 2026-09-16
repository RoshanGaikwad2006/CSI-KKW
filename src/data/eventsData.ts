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
  tags?: string[];
  whatToExpect?: {
    title: string;
    desc: string;
    icon: "sessions" | "drive" | "talks" | "cert";
  }[];
}

export const eventsData: EventItem[] = [
  {
    id: "e-yantran-2026",
    title: "E-Yantran 2026",
    subtitle: "E-Waste Awareness & Collection Mega Drive",
    category: "upcoming",
    categoryBadge: "AWARENESS",
    dateBadge: {
      month: "JAN",
      day: "24",
      year: "2026",
    },
    dateRange: "Jan 24 – Feb 15, 2026",
    time: "10:00 AM – 5:00 PM",
    location: "KKWIEER Campus",
    venueFull: "KKWIEER Campus, Nashik, Maharashtra",
    description:
      "E-Yantran 2026 is a campus-wide initiative to create awareness about electronic waste (e-waste) and promote responsible recycling. Join us to contribute towards a cleaner, greener and more sustainable future.",
    image: "/images/eyantran.png",
    attendees: 500,
    expectedAttendees: "500+ Expected Participants",
    featured: true,
    tags: ["Sustainability", "Environment", "Community", "CSR"],
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
    id: "tech-talk-series",
    title: "Tech Talk Series",
    subtitle: "Emerging Tech & You",
    category: "talks",
    categoryBadge: "TALK",
    dateBadge: {
      month: "AUG",
      day: "12",
      year: "2025",
    },
    dateRange: "Aug 12, 2025",
    time: "2:00 PM – 4:30 PM",
    location: "Seminar Hall, KKWIEER",
    venueFull: "Main Seminar Hall, Ground Floor, KKWIEER",
    description:
      "A deep dive into emerging artificial intelligence frameworks, cloud microservices, and industry engineering practices delivered by prominent alumni and tech leaders.",
    image: "/images/cohort.jpg",
    attendees: 220,
    expectedAttendees: "250+ Attendees",
    featured: false,
    tags: ["Cloud", "AI/ML", "Industry", "Career"],
    whatToExpect: [
      {
        title: "Keynote Addresses",
        desc: "Insights into hiring trends and next-generation cloud architectures.",
        icon: "talks",
      },
      {
        title: "Q&A Session",
        desc: "Interactive live technical discussion with senior architects.",
        icon: "sessions",
      },
      {
        title: "Networking Tea",
        desc: "Direct peer networking and mentorship opportunity.",
        icon: "drive",
      },
      {
        title: "Participation Kit",
        desc: "Digital resource kit with slides, code samples, and roadmap.",
        icon: "cert",
      },
    ],
  },
  {
    id: "codeverse-2-0",
    title: "CodeVerse 2.0",
    subtitle: "Intra-College Hackathon",
    category: "hackathons",
    categoryBadge: "COMPETITION",
    dateBadge: {
      month: "MAR",
      day: "3",
      year: "2025",
    },
    dateRange: "Mar 3–4, 2025",
    time: "9:00 AM (24h Hackathon)",
    location: "Online / KKWIEER",
    venueFull: "High Performance Computing Labs & Online Discord",
    description:
      "A 24-hour sprint tackling real-world societal and industrial challenges. Assemble your squad of 2–4 hackers, prototype solutions, and present to veteran judges for cash prizes.",
    image: "/images/c2c.png",
    attendees: 300,
    expectedAttendees: "350+ Hackers",
    featured: true,
    tags: ["Hackathon", "Coding", "Open Source", "Prizes"],
    whatToExpect: [
      {
        title: "Problem Statements",
        desc: "Tracks in EdTech, FinTech, GreenTech, and AI for Social Good.",
        icon: "sessions",
      },
      {
        title: "Midnight Mentorship",
        desc: "One-on-one debugging and pitch refinement sessions.",
        icon: "talks",
      },
      {
        title: "Cash Prizes",
        desc: "Prize pool of INR 25,000 + goodies, swags, and internship referrals.",
        icon: "drive",
      },
      {
        title: "Official CSI Badges",
        desc: "Verified digital credential badges on LinkedIn.",
        icon: "cert",
      },
    ],
  },
  {
    id: "ai-robotics-workshop",
    title: "AI & Robotics Workshop",
    subtitle: "Hands-on with the Future",
    category: "workshops",
    categoryBadge: "WORKSHOP",
    dateBadge: {
      month: "FEB",
      day: "10",
      year: "2025",
    },
    dateRange: "Feb 10, 2025",
    time: "10:00 AM – 4:00 PM",
    location: "Robotics Lab, KKWIEER",
    venueFull: "Department of Computer Engineering - Advanced Robotics Lab",
    description:
      "Build ROS-based autonomous robot controllers and integrate computer vision models with microcontrollers. Complete hands-on hardware kit provided.",
    image: "/images/pc.jpg",
    attendees: 80,
    expectedAttendees: "80 Hands-on Seats",
    featured: false,
    tags: ["Robotics", "IoT", "Computer Vision", "Hands-on"],
    whatToExpect: [
      {
        title: "Hardware Kits",
        desc: "ESP32, motors, ultrasonic sensors, and OpenCV pipeline setups.",
        icon: "drive",
      },
      {
        title: "Live Programming",
        desc: "Write control loops and real-time obstacle avoidance algorithms.",
        icon: "sessions",
      },
      {
        title: "Robo-Race Contest",
        desc: "Mini line follower challenge with on-the-spot recognition.",
        icon: "talks",
      },
      {
        title: "Skill Certification",
        desc: "Hands-on embedded systems workshop certificate.",
        icon: "cert",
      },
    ],
  },
  {
    id: "green-tech-initiative",
    title: "Green Tech Initiative",
    subtitle: "Sustainable Solutions for Tomorrow",
    category: "community",
    categoryBadge: "COMMUNITY",
    dateBadge: {
      month: "MAR",
      day: "15",
      year: "2025",
    },
    dateRange: "Mar 15, 2025",
    time: "9:30 AM – 1:00 PM",
    location: "KKWIEER Campus",
    venueFull: "Open Amphitheatre & Central Campus Garden",
    description:
      "Explore carbon-neutral computing, green server architectures, and smart IoT-based campus energy management initiatives driven by student innovations.",
    image: "/images/cohort.jpg",
    attendees: 160,
    expectedAttendees: "200+ Volunteers",
    featured: false,
    tags: ["Green Computing", "Sustainability", "Community", "CSR"],
    whatToExpect: [
      {
        title: "Campus Audit",
        desc: "Audit energy benchmarks and brainstorm sensor-based monitoring.",
        icon: "drive",
      },
      {
        title: "Student Project Demos",
        desc: "Smart irrigation and solar automated controllers showcased.",
        icon: "sessions",
      },
      {
        title: "Green Pledge",
        desc: "Chapter-wide environmental stewardship declaration.",
        icon: "talks",
      },
      {
        title: "Volunteer Credits",
        desc: "CSI social responsibility credits recorded.",
        icon: "cert",
      },
    ],
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    subtitle: "Stay Aware, Stay Safe",
    category: "webinars",
    categoryBadge: "WEBINAR",
    dateBadge: {
      month: "APR",
      day: "5",
      year: "2025",
    },
    dateRange: "Apr 5, 2025",
    time: "6:00 PM – 8:00 PM",
    location: "Online",
    venueFull: "Google Meet / CSI Live Stream",
    description:
      "Interactive session dissecting modern social engineering vectors, zero-day vulnerabilities, API authentication lapses, and practical defense posture for software developers.",
    image: "/images/c2c.png",
    attendees: 420,
    expectedAttendees: "500+ Virtual Participants",
    featured: false,
    tags: ["Cybersecurity", "Network", "Infosec", "Webinar"],
    whatToExpect: [
      {
        title: "Live Bug Bounty Breakdown",
        desc: "Deconstructing OWASP Top 10 vulnerabilities in modern web applications.",
        icon: "sessions",
      },
      {
        title: "Security Tooling",
        desc: "Introduction to Wireshark, BurpSuite, and endpoint protection.",
        icon: "drive",
      },
      {
        title: "Career Roadmap",
        desc: "Certifications (CEH, OSCP, CompTIA Security+) navigation.",
        icon: "talks",
      },
      {
        title: "Certificate of Attendance",
        desc: "Verifiable digital certificate of cybersecurity training.",
        icon: "cert",
      },
    ],
  },
];
