import type { MetadataRoute } from "next";

const BASE_URL = "https://kantaka-sodhana.app";

const DEMO_IDS = [
  "uc-rs",
  "uc-docforgery",
  "uc-clinical",
  "uc-dupcheck",
  "uc-qrverify",
  "uc-sameday",
  "uc-family",
  "uc-medoo",
  "uc-medai",
  "uc-whatsapp-face",
  "uc-resume",
];

const ACHIEVEMENT_SLUGS = ["ps-02-radiology", "ps-03-document-forgery"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/achievements`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/what-we-do`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/what-we-build`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const demoPages: MetadataRoute.Sitemap = DEMO_IDS.map((id) => ({
    url: `${BASE_URL}/demo/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const achievementPages: MetadataRoute.Sitemap = ACHIEVEMENT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/achievements/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...demoPages, ...achievementPages];
}
