import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/dashboard", "/login", "/signup"],
      },
    ],
    sitemap: "https://kantaka-sodhana.app/sitemap.xml",
  };
}
