import type { MetadataRoute } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_PRODUCTION_URL}/sitemap.xml`,
  };
}
