import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/lib/auth";

const SITE_URL = "https://kantaka-sodhana.app";
const SITE_TITLE = "Kantaka Sodhana - AI & MLOps Platform";
const SITE_DESC =
  "Removing the Thorns of Deception. AI-powered fraud detection and model governance platform for healthcare insurance claims.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Kantaka Sodhana",
  },
  description: SITE_DESC,
  keywords: [
    "fraud detection",
    "healthcare",
    "AI",
    "MLOps",
    "document verification",
    "Kantaka Sodhana",
    "NHA",
    "AB PM-JAY",
    "medical claims",
    "deepfake detection",
  ],
  authors: [{ name: "Kantaka Sodhana" }],
  creator: "Kantaka Sodhana",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Kantaka Sodhana",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kantaka Sodhana - AI and MLOps Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kantaka Sodhana",
  url: SITE_URL,
  logo: SITE_URL + "/og-image.png",
  description: SITE_DESC,
  sameAs: ["https://github.com/Sumanth-tks/kanta-sodhana-web-app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
