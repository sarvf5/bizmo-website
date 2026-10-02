"use client";

import { useEffect, useRef } from "react";
import { ed } from "@/lib/content";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);

/**
 * Centered launch hero. On scroll the headline lifts away and the tablet rises into the centre
 * of the screen and grows slightly, the way Apple product pages hand the stage to the product.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    // where the device starts (under the headline) and where it comes to rest (centred in view)
    let travel = 0;
    const measure = () => {
      const d = device.current!;
      const start = d.offsetTop;
      const h = d.offsetHeight * 1.05;
      const end = Math.max(64, (innerHeight - h) / 2 + 26);
      travel = end - start;
    };
    const paint = () => {
      raf = 0;
      const r = section.current!.getBoundingClientRect();
      const span = Math.max(1, r.height - innerHeight);
      const p = clamp01(-r.top / span);
      const k = ease(p);
      copy.current!.style.transform = `translate3d(0, ${(-k * 90).toFixed(1)}px, 0)`;
      copy.current!.style.opacity = String(clamp01(1 - p * 2.2));
      device.current!.style.transform = `translate3d(0, ${(k * travel).toFixed(1)}px, 0) scale(${(1 + k * 0.05).toFixed(4)})`;
      shadow.current!.style.opacity = String(1 - k * 0.3);
    };
    measure();
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      kick();
    };
    paint();
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} id="overview" data-surface="light" aria-labelledby="hero-title" className="relative h-[175svh] bg-white">
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden pt-[calc(52px+clamp(2.5rem,7vh,5rem))]">
        <div ref={copy} className="hero-in relative z-10 flex flex-col items-center px-[22px] text-center will-change-transform">
          <h1 id="hero-title" className="t-hero">
            <span className="block">{ed.hero.title[0]}</span>
            <span className="block text-ink-3">{ed.hero.title[1]}</span>
          </h1>
          <p className="t-intro mt-5 max-w-[34rem] text-ink-2 md:mt-6">{ed.hero.sub}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <a href="#notify" className="btn btn-blue">
              {ed.cta}
            </a>
            <a href="#inside" className="link text-[17px]">
              {ed.hero.more}
              <Chevron />
            </a>
          </div>
        </div>

        <div ref={device} className="hero-device relative mt-[clamp(2rem,6vh,4rem)] w-[min(1000px,92vw,calc((100svh-150px)*1.53))] origin-top will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/apple/front.webp" alt="Bizmo tablet, front view, showing the official beach wallpaper" className="relative z-10 block w-full" fetchPriority="high" />
          <div ref={shadow} aria-hidden="true" className="absolute inset-x-[8%] -bottom-[4%] h-[9%] rounded-[50%] bg-black/25 blur-2xl" />
        </div>
      </div>
      <p className="t-small absolute inset-x-0 bottom-[6svh] text-center text-ink-3">{ed.hero.status}</p>
    </section>
  );
}

export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 14" className={`h-[0.7em] w-auto rtl:rotate-180 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
