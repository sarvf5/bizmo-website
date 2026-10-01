"use client";

import { useEffect, useRef, useState } from "react";
import { specs } from "@/lib/content";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = "0";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 4))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{to}</span>;
}

export default function SpecSheet() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="spec-sheet" aria-labelledby="spec-title" className="relative bg-night py-28 md:py-44">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end">
          <h2 id="spec-title" className="display display-lg text-white" data-reveal-lines>
            <span className="line-mask">
              <span>{specs.title}</span>
            </span>
          </h2>
          <p className="max-w-[26rem] text-mist md:pb-2" data-reveal>
            {specs.lead}
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-y border-white/10 md:mt-24 md:grid-cols-4">
          {specs.stats.map((s, i) => (
            <div key={s.label} className={`px-1 py-10 md:px-8 md:py-14 ${i % 2 ? "border-s border-white/10" : ""} ${i > 0 ? "md:border-s md:border-white/10" : ""} ${i < 2 ? "max-md:border-b max-md:border-white/10" : ""}`} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <dd className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-none font-light text-white tabular-nums">
                <Count to={s.value} />
                <span className="ms-2 font-sans text-[0.22em] font-normal tracking-[0.04em] text-mist">{s.unit}</span>
              </dd>
              <dt className="mt-4 text-[0.88rem] text-mist">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-20">
          <p className="act">Full list</p>
          <ul className="border-t border-white/10">
            {specs.rows.map((r, i) => {
              const on = open === i;
              return (
                <li key={r.k} className="border-b border-white/10">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`spec-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      data-cursor={on ? "Close" : "Open"}
                      className="flex w-full items-center justify-between gap-6 py-6 text-start"
                    >
                      <span className={`font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-light transition-colors duration-500 ${on ? "text-white" : "text-aluminium/70"}`}>{r.k}</span>
                      <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                        <span className="absolute top-1/2 left-0 h-px w-4 bg-aluminium/70" />
                        <span className={`absolute top-0 left-1/2 h-4 w-px bg-aluminium/70 transition-transform duration-500 ${on ? "scale-y-0" : ""}`} />
                      </span>
                    </button>
                  </h3>
                  <div id={`spec-${i}`} className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-[40rem] pb-7 text-[1.05rem] text-aluminium/80">{r.v}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
