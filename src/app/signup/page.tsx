"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    purpose: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
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
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">REQUEST ACCESS</h1>
        <p className="text-[var(--text-muted)] font-mono text-sm mb-6">Admin will review and approve your request.</p>

        {success ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="font-mono text-sm text-emerald-400">✓ Registration successful! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-mono text-xs uppercase text-[var(--text-muted)] mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[var(--text-muted)] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[var(--text-muted)] mb-1">Password (8+ chars)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[var(--text-muted)] mb-1">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[var(--text-muted)] mb-1">Purpose (optional)</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Why do you need access?"
                rows={3}
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
              {loading ? "Submitting..." : "Request Access →"}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-[var(--border)] pt-6 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Already have access? <Link href="/login" className="text-[var(--accent)]">Login</Link>
          </p>
        </div>

        <Link href="/" className="mt-4 block text-center font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
          ← Back Home
        </Link>
      </motion.div>
    </div>
  );
}
