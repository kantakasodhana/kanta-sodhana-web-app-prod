"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = type === "success" ? CheckCircle : XCircle;
  const borderColor = type === "success" ? "border-green-500/30" : "border-red-500/30";
  const bgColor = type === "success" ? "bg-green-500/10" : "bg-red-500/10";
  const iconColor = type === "success" ? "text-green-400" : "text-red-400";

  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md px-5 py-4 shadow-2xl transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <Icon size={18} className={iconColor} />
      <span className="font-mono text-sm text-[var(--text)]">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 text-[var(--text-muted)] hover:text-[var(--text)] transition"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
