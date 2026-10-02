"use client";

import { useEffect, useRef, useState } from "react";
import { ed } from "@/lib/content";
import HomeDevice from "./HomeDevice";

/**
 * "Get the highlights": a horizontal gallery of tall tiles. Native scroll-snap (so trackpads,
 * touch and keyboards all behave as people expect), dots that follow the gallery, and a
 * play/pause control for the gentle auto-advance.
 */
export default function Highlights() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const slides = ed.highlights.slides;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const el = track.current!;
    const cards = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement));
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    vis.observe(el);
    return () => {
      io.disconnect();
      vis.disconnect();
    };
  }, []);

  const go = (i: number) => {
    const el = track.current!;
    const card = el.children[i] as HTMLElement;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - pad, behavior: "smooth" });
  };

  useEffect(() => {
    if (!playing || !inView) return;
    const t = setTimeout(() => go((active + 1) % slides.length), 5200);
    return () => clearTimeout(t);
  }, [playing, inView, active, slides.length]);

  return (
    <section id="highlights" data-surface="light" aria-labelledby="hl-title" className="bg-white pt-24 pb-24 md:pt-36 md:pb-32">
      <div className="wrap-wide">
        <h2 id="hl-title" className="t-h2 ps-[max(0px,calc((100%-1080px)/2))]" data-reveal>
          {ed.highlights.title}
        </h2>
      </div>
      <div
        ref={track}
        className="mt-10 flex snap-x snap-mandatory scroll-px-[max(22px,calc((100vw-1080px)/2))] gap-5 overflow-x-auto scroll-smooth px-[max(22px,calc((100vw-1080px)/2))] pb-2 [scrollbar-width:none] md:mt-14 [&::-webkit-scrollbar]:hidden"
        onPointerDown={() => setPlaying(false)}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && setPlaying(false)}
        tabIndex={0}
        aria-label="Highlights gallery"
        role="region"
      >
        {slides.map((s, i) => (
          <article
            key={s.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={`tile flex h-[min(680px,78svh)] w-[min(1080px,86vw)] max-md:h-[min(31rem,70svh)] shrink-0 snap-start flex-col ${s.id === "camera" ? "bg-[#e9e9ea]" : "bg-canvas"}`}
          >
            <p className="t-intro relative z-10 max-w-[30rem] px-7 pt-8 md:px-12 md:pt-12">
              <span className="text-ink">{s.lead}</span> <span className="text-ink-2">{s.rest}</span>
            </p>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 pb-6 md:px-12 md:pb-10">
              {s.img === "home" ? (
                <HomeDevice className="w-[min(100%,760px,calc((min(680px,78svh)-230px)*1.535))] drop-shadow-[0_30px_40px_rgb(0_0_0/0.18)]" />
              ) : s.id === "camera" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.img} alt={s.alt} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_60%]" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.img} alt={s.alt} loading="lazy" className={`max-h-full w-auto max-w-full object-contain ${s.id === "distinct" ? "w-[min(100%,760px)] drop-shadow-[0_30px_40px_rgb(0_0_0/0.16)]" : "mix-blend-multiply"}`} />
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="flex items-center gap-3 rounded-full bg-canvas px-5 py-[15px]">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show highlight ${i + 1}: ${s.lead}`}
              aria-current={i === active}
              onClick={() => {
                setPlaying(false);
                go(i);
              }}
              className={`h-2 rounded-full transition-all duration-500 ease-[var(--ease-apple)] ${i === active ? "w-12 bg-ink/75" : "w-2 bg-ink/30 hover:bg-ink/50"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause highlights" : "Play highlights"}
          className="grid h-[38px] w-[38px] place-items-center rounded-full bg-canvas text-ink/80 transition-colors hover:bg-[#e8e8ed]"
        >
          {playing ? (
            <svg viewBox="0 0 12 14" className="h-3 w-3" fill="currentColor" aria-hidden="true">
              <rect x="1" y="1" width="3.2" height="12" rx="1" />
              <rect x="7.8" y="1" width="3.2" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 14" className="ms-0.5 h-3 w-3" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 2 1.5Z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
