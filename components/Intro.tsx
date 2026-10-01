"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Opening moment: the Bizmo mark on black while the first film loads, then the curtain lifts.
 * Sets <html data-intro="done"> so the hero headline can rise in after it.
 * Shown once per visit; skipped for reduced motion.
 */
export default function Intro() {
  const [phase, setPhase] = useState<"on" | "leaving" | "gone">("on");
  const count = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem("bizmo-intro") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.intro = "done";
      setPhase("gone");
      return;
    }
    let shown = 0;
    let target = 0;
    let raf = 0;
    let finished = false;
    const start = performance.now();

    const onProgress = (e: Event) => {
      const d = (e as CustomEvent<{ key: string; loaded: number; total: number }>).detail;
      if (d.key !== "turn") return;
      // the hero needs the first quarter of the film; the rest keeps loading behind the page
      target = Math.max(target, Math.min(1, d.loaded / Math.max(1, d.total * 0.22)));
    };
    window.addEventListener("film:progress", onProgress);

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("bizmo-intro", "1");
      } catch {}
      setPhase("leaving");
      setTimeout(() => (root.dataset.intro = "done"), 450);
      setTimeout(() => setPhase("gone"), 1500);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      // never hold anyone longer than 4 seconds
      const floor = Math.min(1, elapsed / 4000);
      const goal = Math.max(target, floor);
      shown += (goal - shown) * 0.08;
      if (count.current) count.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (line.current) line.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (shown > 0.995 && elapsed > 1300) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("film:progress", onProgress);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-night transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ clipPath: phase === "leaving" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
    >
      <div className={`flex flex-col items-center transition-opacity duration-500 ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bizmo-wordmark-white.svg" alt="" className="h-9 w-auto md:h-11" />
        <div className="mt-10 h-px w-44 overflow-hidden bg-white/10">
          <div ref={line} className="h-full origin-left bg-gradient-to-r from-cobalt to-cyan" style={{ transform: "scaleX(0)" }} />
        </div>
        <span ref={count} className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-mist">
          000
        </span>
      </div>
    </div>
  );
}
