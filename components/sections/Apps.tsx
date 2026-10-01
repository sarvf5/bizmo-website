"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { apps } from "@/lib/content";

/** Three rows of approved app names drifting in alternate directions; scrolling speeds them up. */
function Marquee() {
  const rows = useMemo(() => {
    const all = apps.categories.flatMap((c) => c.apps);
    // spread categories across the rows so each row reads as a mix
    const r: string[][] = [[], [], []];
    all.forEach((a, i) => r[i % 3].push(a));
    return r;
  }, []);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const offsets = [0, -400, -200];
    const speeds = [0.35, -0.28, 0.42];
    let boost = 0;
    let lastY = scrollY;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap.current!);
    function loop() {
      raf = 0;
      const dy = scrollY - lastY;
      lastY = scrollY;
      boost += (Math.min(Math.abs(dy), 80) * 0.09 - boost) * 0.08;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const half = el.scrollWidth / 2;
        offsets[i] -= speeds[i] * (1 + boost * 6);
        if (offsets[i] <= -half) offsets[i] += half;
        if (offsets[i] > 0) offsets[i] -= half;
        el.style.transform = `translate3d(${offsets[i].toFixed(2)}px, 0, 0)`;
      });
      if (visible) raf = requestAnimationFrame(loop);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="group/marquee relative mt-20 select-none md:mt-28" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12vw] bg-gradient-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12vw] bg-gradient-to-l from-night to-transparent" />
      {rows.map((row, i) => (
        <div key={i} className="overflow-hidden py-1.5 md:py-2.5">
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="marquee"
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {row.map((name) => (
                  <span key={name + dup} className="flex items-center">
                    <span
                      className={`px-5 font-display text-[clamp(2rem,4.6vw,4.75rem)] leading-none font-light whitespace-nowrap transition-colors duration-500 hover:text-white md:px-8 ${
                        i === 1 ? "text-aluminium/30" : "text-aluminium/55"
                      } group-hover/marquee:text-aluminium/25 hover:!text-white`}
                    >
                      {name}
                    </span>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-tr from-cobalt to-cyan opacity-70" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Apps() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = apps.categories[active];

  const onKey = (e: KeyboardEvent) => {
    const n = apps.categories.length;
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="apps" aria-labelledby="apps-title" className="relative overflow-hidden bg-night pt-32 pb-28 md:pt-48 md:pb-40">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 start-1/3 h-[38rem] w-[60rem] rounded-full bg-[radial-gradient(closest-side,rgb(4_99_239/0.13),transparent)]" />
      <div className="wrap relative">
        <p className="act" data-reveal>
          Act II <span className="px-2 text-dim">/</span> Approved apps
        </p>
        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:items-end md:gap-16">
          <h2 id="apps-title" className="display display-xl text-white" data-reveal-lines>
            <span className="line-mask">
              <span>About 190</span>
            </span>
            <span className="line-mask">
              <span style={{ ["--d" as string]: "0.1s" }}>business apps.</span>
            </span>
            <span className="line-mask">
              <span className="text-aluminium/45" style={{ ["--d" as string]: "0.2s" }}>
                {apps.titleSecond}
              </span>
            </span>
          </h2>
          <p className="lede max-w-[28rem] text-aluminium/70 md:pb-3" data-reveal style={{ ["--d" as string]: "0.3s" }}>
            {apps.body}
          </p>
        </div>
      </div>

      <Marquee />

      <div className="wrap relative">
        <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-20">
          <div>
            <p className="act">Browse by category</p>
            <div role="tablist" aria-label="App categories" aria-orientation="vertical" className="mt-6 flex flex-col border-t border-white/10" onKeyDown={onKey}>
              {apps.categories.map((c, i) => {
                const on = i === active;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${c.id}`}
                    aria-selected={on}
                    aria-controls="apps-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    data-cursor="Open"
                    className={`group flex items-baseline justify-between gap-6 border-b border-white/10 py-3.5 text-start transition-colors duration-500 ${on ? "text-white" : "text-mist hover:text-aluminium"}`}
                  >
                    <span className="flex items-center gap-3 text-[1rem]">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-tr from-cobalt to-cyan shadow-[0_0_8px_rgb(45_218_255/0.9)] transition-[opacity,transform] duration-500 ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                      />
                      {c.name}
                    </span>
                    <span className="font-mono text-[0.75rem] tracking-[0.1em] tabular-nums">{String(c.count).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id="apps-panel" role="tabpanel" aria-labelledby={`tab-${cat.id}`} className="min-h-[24rem] md:pt-12">
            <p className="font-display text-[clamp(4rem,9vw,8.5rem)] leading-none font-light text-white tabular-nums">{cat.count}</p>
            <p className="mt-3 text-[0.95rem] text-mist">approved {cat.name.toLowerCase()} apps, including</p>
            <ul key={cat.id} className="apps-list mt-8 columns-1 gap-10 sm:columns-2 lg:columns-3">
              {cat.apps.map((a, i) => (
                <li key={a} className="break-inside-avoid border-t border-white/[0.07] py-2.5 text-[1.05rem] text-aluminium/90" style={{ animationDelay: `${i * 25}ms` }}>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-28 md:mt-40" data-reveal>
          <p className="act">{apps.notTitle}</p>
          <ul className="mt-8 flex flex-wrap gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-4 font-display text-[clamp(1.9rem,4vw,3.75rem)] leading-tight font-light text-aluminium/50" aria-label="Not available on Bizmo">
            {apps.not.map((n, i) => (
              <li key={n}>
                <span className="strike" style={{ ["--d" as string]: `${0.4 + i * 0.12}s` }}>
                  {n}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[44rem] text-[0.82rem] text-dim">{apps.note}</p>
        </div>
      </div>
    </section>
  );
}
