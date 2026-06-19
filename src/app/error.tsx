"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.error("Runtime error:", error);
  }, [error]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      const imageData = ctx.createImageData(w, h);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() > 0.88 ? Math.floor(Math.random() * 60) : 0;
        imageData.data[i] = Math.floor(v * 0.8);
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = Math.random() > 0.92 ? 160 : 0;
      }
      ctx.putImageData(imageData, 0, 0);

      for (let j = 0; j < 4; j++) {
        if (Math.random() > 0.6) {
          const y = Math.random() * h;
          ctx.fillStyle = "rgba(200, 0, 0, " + String(Math.random() * 0.06) + ")";
          ctx.fillRect(0, y, w, Math.random() * 3 + 1);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const digestLabel = error.digest ? " · " + error.digest : "";

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 text-center px-6">
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-red-500 mb-6 animate-pulse">
          System Fault
        </p>

        <div className="font-mono text-[80px] sm:text-[120px] md:text-[200px] font-bold leading-none text-[var(--text)] opacity-10 select-none mb-4">
          500
        </div>

        <h1 className="font-mono text-3xl md:text-5xl font-bold text-[var(--text)] mb-4 -mt-8 relative z-10">
          SYSTEM FAULT
        </h1>

        <p className="font-mono text-sm text-[var(--text-muted)] mb-2 max-w-sm mx-auto leading-relaxed">
          An unexpected error disrupted the operation. The system logged the incident automatically.
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-12">
          {`ERR_RUNTIME_FAULT${digestLabel} · CODE 500`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-block rounded-full border border-[var(--accent)] px-8 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-white"
          >
            Retry Operation
          </button>
          <Link
            href="/"
            className="inline-block rounded-full border border-[var(--border)] px-8 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </main>
  );
}
