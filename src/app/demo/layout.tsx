import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Case Demos",
  description:
    "Live demos of Kantaka Śodhana fraud detection use cases — risk scoring, document forgery, duplicate detection, family clustering, and more.",
  openGraph: {
    title: "Use Case Demos | Kantaka Śodhana",
    description:
      "Live demos of AI-powered healthcare fraud detection use cases.",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
