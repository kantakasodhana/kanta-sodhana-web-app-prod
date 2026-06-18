import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Kantaka Śodhana team for deployment conversations, forensic reviews, or system integrations.",
  openGraph: {
    title: "Contact | Kantaka Śodhana",
    description:
      "Get in touch with the Kantaka Śodhana team for deployment conversations and integrations.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
