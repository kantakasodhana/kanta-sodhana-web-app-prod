import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the Kantaka Śodhana operating unit — engineers, data scientists, and ML specialists building AI-driven fraud detection.",
  openGraph: {
    title: "Team | Kantaka Śodhana",
    description:
      "Meet the team building AI-driven healthcare fraud detection.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
