export interface SiteConfig {
  name: string;
  shortName: string;
  fullName: string;
  collegeName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  locale: string;
  themeColor: string;
  defaultOgImage: string;
  social: {
    linkedin: string;
    instagram: string;
    github: string;
    collegeWebsite: string;
    nationalWebsite: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: string;
    longitude: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "CSI KKWIEER Student Branch",
  shortName: "CSI KKWIEER",
  fullName: "Computer Society of India - KKWIEER Student Branch",
  collegeName: "K. K. Wagh Institute of Engineering Education and Research, Nashik",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://csikkwieer.in",
  defaultTitle: "CSI KKWIEER | Computer Society of India Student Branch, Nashik",
  titleTemplate: "%s | CSI KKWIEER",
  defaultDescription:
    "Official website of Computer Society of India (CSI) Student Branch at K. K. Wagh Institute of Engineering Education & Research (KKWIEER), Nashik. Explore technical events, hands-on workshops, hackathons, student leadership, and industry conclaves.",
  defaultKeywords: [
    "CSI KKWIEER",
    "Computer Society of India",
    "KKWIEER Nashik",
    "K K Wagh Institute of Engineering Education and Research",
    "CSI Student Branch",
    "CSI Nashik Chapter",
    "CSI India",
    "Computer Engineering Department KKWIEER",
    "Tech Events Nashik",
    "Coding Workshops Nashik",
    "Hackathons KKWIEER",
    "Vision Week 2026",
    "Eyantran",
    "C2C Tech Symposium",
    "Student Chapter",
    "Engineering Student Community"
  ],
  locale: "en_IN",
  themeColor: "#1D68F2",
  defaultOgImage: "/images/og-preview.png",
  social: {
    linkedin: "https://www.linkedin.com/company/csi-kkwieer/",
    instagram: "https://www.instagram.com/csi_kkwieer",
    github: "https://github.com/RoshanGaikwad2006/CSI-KKW",
    collegeWebsite: "https://www.kkwagh.edu.in/engineering/csi",
    nationalWebsite: "https://csiindia.org/",
  },
  address: {
    streetAddress: "Hirabai Haridas Vidyanagari, Mumbai Agra Road, Amrutdham, Panchavati",
    addressLocality: "Nashik",
    addressRegion: "Maharashtra",
    postalCode: "422003",
    addressCountry: "IN",
  },
  geo: {
    latitude: "20.0135914",
    longitude: "73.8222614",
  },
};
