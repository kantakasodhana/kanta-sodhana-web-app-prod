import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "How Kantaka Śodhana detects healthcare insurance fraud — from data ingestion and AI analysis to governed response and audit trails.",
  openGraph: {
    title: "What We Do | Kantaka Śodhana",
    description:
      "How Kantaka Śodhana detects healthcare insurance fraud with AI pipelines.",
  },
};

export default function WhatWeDoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
