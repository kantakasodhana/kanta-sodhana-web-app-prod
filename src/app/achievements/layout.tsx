import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Hackathon wins and recognition — NHA AB PM-JAY Auto-Adjudication Hackathon 2026 at IISc Bengaluru. AI-powered fraud detection for healthcare insurance.",
  openGraph: {
    title: "Achievements | Kantaka Śodhana",
    description:
      "Hackathon wins and recognition — NHA AB PM-JAY Auto-Adjudication Hackathon 2026 at IISc Bengaluru.",
  },
};

const ARTICLES_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Radiological Image-Based Condition Detection and Report Correlation",
    description:
      "Runner-up at NHA AB PM-JAY Hackathon 2026 — AI pipeline for radiology fraud detection.",
    datePublished: "2026-05-09",
    author: { "@type": "Organization", name: "Team Kantaka Sodhana" },
    publisher: {
      "@type": "Organization",
      name: "Kantaka Śodhana",
      url: "https://kantaka-sodhana.app",
    },
    url: "https://kantaka-sodhana.app/achievements/ps-02-radiology",
    image:
      "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/ps2-ceremony.jpg",
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Document Forgery and Deepfake Detection",
    description:
      "3rd Place at NHA AB PM-JAY Hackathon 2026 — multi-layered AI system for detecting forged medical documents.",
    datePublished: "2026-05-09",
    author: { "@type": "Organization", name: "Team Sushurutha Health AI" },
    publisher: {
      "@type": "Organization",
      name: "Kantaka Śodhana",
      url: "https://kantaka-sodhana.app",
    },
    url: "https://kantaka-sodhana.app/achievements/ps-03-document-forgery",
    image:
      "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/ps3-ceremony.jpg",
  },
];

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ARTICLES_JSONLD),
        }}
      />
      {children}
    </>
  );
}
