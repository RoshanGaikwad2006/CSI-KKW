import { SITE_CONFIG } from "../config/seo";
import { EventItem } from "../data/eventsData";

/**
 * Returns JSON-LD structured data for the CSI KKWIEER organization.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.fullName,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/images/csi.png`,
    image: `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultOgImage}`,
    description: SITE_CONFIG.defaultDescription,
    parentOrganization: {
      "@type": "Organization",
      name: "Computer Society of India",
      url: SITE_CONFIG.social.nationalWebsite,
    },
    memberOf: {
      "@type": "CollegeOrUniversity",
      name: SITE_CONFIG.collegeName,
      url: "https://www.kkwagh.edu.in/",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    sameAs: [
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.collegeWebsite,
      SITE_CONFIG.social.nationalWebsite,
    ],
  };
}

/**
 * Returns JSON-LD structured data for the Website.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.siteUrl}/#website`,
    url: SITE_CONFIG.siteUrl,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Returns JSON-LD structured data for Breadcrumbs.
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_CONFIG.siteUrl,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${SITE_CONFIG.siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Returns JSON-LD structured data for an EventItem.
 */
export function getEventSchema(event: EventItem) {
  const isOnline = event.location.toLowerCase().includes("online");
  const year = event.dateBadge.year || 2026;
  const monthNames: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const monthKey = String(event.dateBadge.month).toLowerCase().slice(0, 3);
  const monthNum = monthNames[monthKey] || "09";
  const dayNum = String(event.dateBadge.day).padStart(2, "0");
  const startDateStr = `${year}-${monthNum}-${dayNum}T09:00:00+05:30`;

  const fullImageUrl = event.image.startsWith("http")
    ? event.image
    : `${SITE_CONFIG.siteUrl}${event.image.startsWith("/") ? event.image : `/${event.image}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: event.title,
    description: event.description,
    startDate: startDateStr,
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url: `${SITE_CONFIG.siteUrl}/events`,
        }
      : {
          "@type": "Place",
          name: event.venueFull || event.location,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE_CONFIG.address.streetAddress,
            addressLocality: SITE_CONFIG.address.addressLocality,
            addressRegion: SITE_CONFIG.address.addressRegion,
            postalCode: SITE_CONFIG.address.postalCode,
            addressCountry: SITE_CONFIG.address.addressCountry,
          },
        },
    image: [fullImageUrl],
    organizer: {
      "@type": "EducationalOrganization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
    },
  };
}
