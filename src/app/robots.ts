import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/uploads"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
