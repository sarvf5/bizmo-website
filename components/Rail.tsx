"use client";

import { useEffect, useRef, useState } from "react";

export const ACTS = [
  { id: "system", n: "I", label: "The device" },
  { id: "apps", n: "II", label: "Apps" },
  { id: "speed", n: "III", label: "Speed" },
  { id: "daily", n: "IV", label: "Daily work" },
  { id: "specs", n: "V", label: "Specifications" },
  { id: "trust", n: "VI", label: "Certification" },
  { id: "compare", n: "VII", label: "Compare" },
  { id: "notify", n: "VIII", label: "Launch" },
];

/** The chapter rail on the end side: roman numerals for the eight acts and a progress line. */
export default function Rail() {
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = innerHeight * 0.5;
      let a = 0;
      ACTS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) a = i;
      });
      setActive(a);
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
    };
  }, []);

  return (
    <nav aria-label="Chapters" className="fixed end-[clamp(1rem,2.2vw,2.25rem)] top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative flex items-stretch gap-4">
        <ol className="flex flex-col items-end gap-[0.55rem]">
          {ACTS.map((a, i) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                data-cursor={a.label}
                aria-current={i === active ? "step" : undefined}
                className={`group flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.2em] transition-colors duration-500 ${i === active ? "text-aluminium" : "text-dim hover:text-mist"}`}
              >
                <span className="translate-x-1 whitespace-nowrap opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100">{a.label}</span>
                <span className="w-7 text-end">{a.n}</span>
              </a>
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="relative w-px bg-white/10">
          <div ref={bar} className="absolute inset-0 origin-top bg-gradient-to-b from-cobalt to-cyan" style={{ transform: "scaleY(0)" }} />
        </div>
      </div>
    </nav>
  );
}
