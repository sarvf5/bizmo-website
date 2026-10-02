"use client";

import { useEffect, useRef } from "react";
import { ed } from "@/lib/content";

/** One paragraph, pinned; each word lights up from silver to ink as you scroll through it. */
export default function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const words = ed.manifesto.split(" ");

  useEffect(() => {
    const el = section.current!;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.color = "var(--color-ink)"));
      return;
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / (r.height - innerHeight * 0.6)));
      const lit = p * (spans.length + 2);
      spans.forEach((s, i) => {
        const k = Math.min(1, Math.max(0, lit - i));
        s.style.opacity = (0.22 + 0.78 * k).toFixed(3);
      });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    addEventListener("scroll", kick, { passive: true });
    return () => {
      removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} data-surface="light" aria-label="What Bizmo is" className="relative h-[200svh] bg-white">
      <div className="sticky top-0 flex h-svh items-center">
        <p className="wrap t-h2 !text-[clamp(1.9rem,4.2vw,3.6rem)] !leading-[1.12]">
          {words.map((w, i) => (
            <span key={i} data-w className="transition-opacity duration-200" style={{ opacity: 0.22 }}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
