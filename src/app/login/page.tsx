"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Reload page to sync auth state
      window.location.href = "/#use-cases";
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
      >
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">AUTHENTICATE</h1>
        <p className="text-[var(--text-muted)] font-mono text-sm mb-6">Login to access use cases.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="font-mono text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent)] py-2.5 font-mono text-sm font-bold uppercase text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <div className="mt-6 border-t border-[var(--border)] pt-6 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            No account? <Link href="/signup" className="text-[var(--accent)]">Request Access</Link>
          </p>
        </div>

        <Link href="/" className="mt-4 block text-center font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
          ← Back Home
        </Link>
      </motion.div>
    </div>
  );
}
