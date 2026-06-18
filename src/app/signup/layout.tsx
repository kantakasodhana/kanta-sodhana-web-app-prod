import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Request access to the Kantaka Śodhana platform for healthcare fraud detection and analysis.",
  robots: { index: false, follow: false },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
