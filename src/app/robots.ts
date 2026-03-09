import type { MetadataRoute } from "next";

const SITE_URL = "https://dailydeveloperinsights.tech";

// Robots configuration optimized for AdSense crawling
// Ensures all public pages are indexable while protecting admin and API routes
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
