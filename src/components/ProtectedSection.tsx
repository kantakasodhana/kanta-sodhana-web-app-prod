"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectedSection({
  children,
  title = "ACCESS RESTRICTED",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">
          Checking access...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-24 px-6"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10">
              <Lock size={24} className="text-[var(--accent)]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)] mb-2 font-mono">{title}</h3>
          <p className="text-[var(--text-muted)] font-mono text-sm mb-6">
            Login to access use cases, demos, and advanced features.
          </p>
          <div className="flex gap-3 flex-col">
            <Link
              href="/login"
              className="rounded-full bg-[var(--accent)] px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[var(--border)] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Request Access
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
