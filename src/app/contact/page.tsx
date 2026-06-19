"use client";

import { useState, useCallback } from "react";
import Toast from "@/components/Toast";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(form: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) {
    errors.name = "Name is required";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!form.message.trim()) {
    errors.message = "Message is required";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sent, setSent] = useState(false);

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const dismissToast = useCallback(() => setToast(null), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        setToast({ message: "Message sent successfully!", type: "success" });
        setForm({ name: "", email: "", message: "" });
        setTouched({});
        setErrors({});
      } else {
        setToast({ message: data.message || "Something went wrong. Please try again.", type: "error" });
      }
    } catch {
      setToast({ message: "Could not reach server. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-lg border ${
      touched[field] && errors[field]
        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
        : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/30"
    } bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:ring-1`;

  const charCount = form.message.length;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}

      <div className="mx-auto max-w-2xl">
        <div className="mb-16">
          <p className="font-mono text-[10px] tracking-[0.5em] text-[var(--accent)] uppercase mb-4">
            Reach Out
          </p>
          <h1 className="font-mono text-5xl md:text-7xl font-bold text-[var(--text)] leading-tight mb-6">
            Contact
          </h1>
          <p className="font-mono text-sm text-[var(--text-muted)] leading-relaxed">
            For partnerships, deployments, or just a conversation about fraud
            detection at scale.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-px border border-[var(--border)] rounded-2xl overflow-hidden">
          {[
            { label: "Location", value: "17.3850° N, 78.4867° E" },
            { label: "Based in", value: "Hyderabad, India" },
            { label: "Domain", value: "AI & MLOps" },
            { label: "Focus", value: "Fraud Detection" },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--surface)] px-6 py-5">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-1">
                {item.label}
              </div>
              <div className="font-mono text-sm text-[var(--text)]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--surface)] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
            <div className="font-mono text-4xl font-bold text-[var(--accent)] mb-4">
              {"✓"}
            </div>
            <div className="font-mono text-lg font-bold text-[var(--text)] mb-2">
              Message received.
            </div>
            <div className="font-mono text-sm text-[var(--text-muted)] mb-6">
              We will be in touch shortly.
            </div>
            <button
              onClick={() => setSent(false)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="contact-name"
                className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-2"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={inputClass("name")}
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {touched.name && errors.name && (
                <p id="name-error" className="mt-1.5 font-mono text-[11px] text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={inputClass("email")}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {touched.email && errors.email && (
                <p id="email-error" className="mt-1.5 font-mono text-[11px] text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Tell us about your use case..."
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                className={inputClass("message") + " resize-none"}
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={errors.message ? "message-error" : "message-count"}
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-1.5">
                {touched.message && errors.message ? (
                  <p id="message-error" className="font-mono text-[11px] text-red-400">
                    {errors.message}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  id="message-count"
                  className={`font-mono text-[10px] ${
                    charCount > 1800 ? "text-red-400" : "text-[var(--text-muted)]"
                  }`}
                >
                  {charCount}/2000
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[var(--accent)] py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white transition-all hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message →"
              )}
            </button>
          </form>
        )}

        <div className="mt-16 text-center border-t border-[var(--border)] pt-8">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--text-muted)]">
            Kantaka Sodhana LLP · Hyderabad · Est. 2024
          </p>
        </div>
      </div>
    </main>
  );
}
