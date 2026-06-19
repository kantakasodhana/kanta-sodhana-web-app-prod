"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import GrainOverlay from "@/components/GrainOverlay";
import PageTransition from "@/components/PageTransition";
import Preloader from "@/components/Preloader";
import ClientCursor from "@/components/ClientCursor";

const CHROMELESS_PATHS: string[] = [];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChromeless = pathname ? CHROMELESS_PATHS.includes(pathname) : false;

  if (isChromeless) {
    return (
      <>
        <ClientCursor />
        {children}
      </>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white focus:font-mono focus:text-xs"
      >
        Skip to content
      </a>
      <ClientCursor />
      <Preloader />
      <ScrollProgress />
      <GrainOverlay />
      <Navigation />
      <PageTransition>
        <main id="main-content" className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
    </>
  );
}
