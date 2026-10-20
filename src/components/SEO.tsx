import React from "react";
import Head from "next/head";
import { SITE_CONFIG } from "../config/seo";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[] | string;
  ogType?: "website" | "article" | "profile" | "event";
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any> | null | undefined>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = SITE_CONFIG.defaultDescription,
  canonical,
  keywords = SITE_CONFIG.defaultKeywords,
  ogType = "website",
  ogImage = SITE_CONFIG.defaultOgImage,
  ogImageAlt,
  noindex = false,
  jsonLd,
}) => {
  const pageTitle = title
    ? SITE_CONFIG.titleTemplate.replace("%s", title)
    : SITE_CONFIG.defaultTitle;

  const keywordsString = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  // Compute canonical URL
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${SITE_CONFIG.siteUrl}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : SITE_CONFIG.siteUrl;

  // Compute absolute OG image URL
  const fullOgImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_CONFIG.siteUrl}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

  // Normalize JSON-LD schemas
  const schemas: Record<string, any>[] = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLd.forEach((item) => {
        if (item) schemas.push(item);
      });
    } else {
      schemas.push(jsonLd);
    }
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <meta name="author" content={SITE_CONFIG.name} />
      <meta name="publisher" content={SITE_CONFIG.name} />

      {/* Indexing Directives */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta
        name="googlebot"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={ogImageAlt || pageTitle} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:image:alt" content={ogImageAlt || pageTitle} />

      {/* Structured Data (JSON-LD) */}
      {schemas.map((schema, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
};

export default SEO;
