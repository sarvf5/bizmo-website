"use client";

import { useEffect, useRef, useState } from "react";
import { ed, speed } from "@/lib/content";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);

/** Two routes drawn as you scroll: the filter server detour, and Bizmo going straight there. */
export default function SpeedEd() {
  const ref = useRef<HTMLElement>(null);
  const slowPath = useRef<SVGPathElement>(null);
  const fastPath = useRef<SVGPathElement>(null);
  const slowDot = useRef<SVGGElement>(null);
  const fastDot = useRef<SVGGElement>(null);
  const slowTrail = useRef<SVGPathElement>(null);
  const fastTrail = useRef<SVGPathElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const el = ref.current!;
    const sp = slowPath.current!;
    const fp = fastPath.current!;
    const sl = sp.getTotalLength();
    const fl = fp.getTotalLength();
    slowTrail.current!.style.strokeDasharray = `${sl}`;
    fastTrail.current!.style.strokeDasharray = `${fl}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = reduced ? 1 : clamp01((innerHeight * 0.85 - r.top) / (r.height * 0.8));
      const f = ease(p / 0.4);
      const s = p < 0.42 ? ease(p / 0.42) * 0.5 : p < 0.64 ? 0.5 : 0.5 + ease((p - 0.64) / 0.36) * 0.5;
      const a = sp.getPointAtLength(s * sl);
      const b = fp.getPointAtLength(f * fl);
      slowDot.current!.setAttribute("transform", `translate(${a.x} ${a.y})`);
      fastDot.current!.setAttribute("transform", `translate(${b.x} ${b.y})`);
      slowTrail.current!.style.strokeDashoffset = `${sl * (1 - s)}`;
      fastTrail.current!.style.strokeDashoffset = `${fl * (1 - f)}`;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, [narrow]);

  const L = speed.lanes;
  const VW = narrow ? 380 : 900;
  const a = narrow ? 24 : 70;
  const b = VW - a;
  const mid = VW / 2;
  const slow = `M ${a} 130 C ${a + (mid - a) * 0.45} 130, ${mid - (mid - a) * 0.45} 60, ${mid} 60 S ${b - (b - mid) * 0.45} 130, ${b} 130`;
  const fast = `M ${a} 320 L ${b} 320`;
  const t1 = narrow ? 17 : 15;
  const t2 = narrow ? 15 : 13;

  return (
    <section ref={ref} id="speed" data-surface="light" aria-labelledby="speed-title" className="bg-white py-24 md:py-36">
      <div className="wrap text-center">
        <h2 id="speed-title" className="t-h1" data-reveal>
          {ed.speed.title}
        </h2>
        <p className="t-intro mx-auto mt-5 max-w-[40rem] text-ink-2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
          {ed.speed.sub}
        </p>
      </div>
      <div className="wrap-wide mt-14 md:mt-20">
        <figure className="tile mx-auto max-w-[1180px] bg-canvas px-4 py-10 md:px-12 md:py-16" dir="ltr">
          <svg viewBox={`0 0 ${VW} 400`} className="h-auto w-full overflow-visible" role="img" aria-labelledby="sp-t">
            <title id="sp-t">A tablet with a filter routes traffic through a filter server before it reaches your apps. Bizmo connects directly.</title>
            <defs>
              <linearGradient id="sp-g" gradientUnits="userSpaceOnUse" x1={a} y1="0" x2={b} y2="0">
                <stop offset="0" stopColor="#0463EF" />
                <stop offset="1" stopColor="#2DDAFF" />
              </linearGradient>
            </defs>
            <text x={a - 6} y="24" fontSize={t1} fontWeight="600" fill="#86868b">
              {L.filter.label}
            </text>
            <path ref={slowPath} d={slow} fill="none" stroke="#d2d2d7" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
            <path ref={slowTrail} d={slow} fill="none" stroke="#86868b" strokeWidth="2.5" strokeLinecap="round" />
            <rect x={mid - 34} y="38" width="68" height="44" rx="12" fill="#fff" stroke="#d2d2d7" />
            <path d={`M ${mid - 18} 54 h 36 M ${mid - 18} 66 h 24`} stroke="#86868b" strokeWidth="2" strokeLinecap="round" />
            <text x={mid} y="108" textAnchor="middle" fontSize={t2} fill="#6e6e73">
              {L.filter.nodes[1]}
            </text>
            <circle cx={a} cy="130" r="6" fill="#86868b" />
            <text x={a - 6} y="162" fontSize={t2} fill="#6e6e73">
              {L.filter.nodes[0]}
            </text>
            <circle cx={b} cy="130" r="6" fill="#86868b" />
            <text x={b + 6} y="162" textAnchor="end" fontSize={t2} fill="#6e6e73">
              {L.filter.nodes[2]}
            </text>
            <g ref={slowDot}>
              <circle r="8" fill="#1d1d1f" />
            </g>

            <text x={a - 6} y="262" fontSize={t1} fontWeight="600" fill="#1d1d1f">
              {L.bizmo.label}
            </text>
            <path ref={fastPath} d={fast} fill="none" stroke="#d2d2d7" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
            <path ref={fastTrail} d={fast} fill="none" stroke="url(#sp-g)" strokeWidth="3" strokeLinecap="round" />
            <circle cx={a} cy="320" r="6" fill="#0463EF" />
            <text x={a - 6} y="352" fontSize={t2} fill="#1d1d1f">
              {L.bizmo.nodes[0]}
            </text>
            <circle cx={b} cy="320" r="6" fill="#2DDAFF" />
            <text x={b + 6} y="352" textAnchor="end" fontSize={t2} fill="#1d1d1f">
              {L.bizmo.nodes[1]}
            </text>
            <g ref={fastDot}>
              <circle r="13" fill="#2DDAFF" opacity="0.25" />
              <circle r="8" fill="url(#sp-g)" />
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
