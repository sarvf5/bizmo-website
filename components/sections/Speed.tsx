"use client";

import { useEffect, useRef, useState } from "react";
import { speed } from "@/lib/content";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);

/**
 * Two routes drawn as the section scrolls through: the filter subscription's detour through a
 * filter server, and Bizmo's direct path. A light travels each route; Bizmo's arrives first.
 */
export default function Speed() {
  const ref = useRef<HTMLElement>(null);
  const slowPath = useRef<SVGPathElement>(null);
  const fastPath = useRef<SVGPathElement>(null);
  const slowDot = useRef<SVGGElement>(null);
  const fastDot = useRef<SVGGElement>(null);
  const slowTrail = useRef<SVGPathElement>(null);
  const fastTrail = useRef<SVGPathElement>(null);
  const slowEnd = useRef<SVGCircleElement>(null);
  const fastEnd = useRef<SVGCircleElement>(null);
  const server = useRef<SVGGElement>(null);
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
      const vh = window.innerHeight;
      const p = reduced ? 1 : clamp01((vh * 0.8 - r.top) / (r.height * 0.75));
      const f = ease(p / 0.38); // Bizmo: straight there
      const s = p < 0.42 ? ease(p / 0.42) * 0.5 : p < 0.62 ? 0.5 : 0.5 + ease((p - 0.62) / 0.38) * 0.5; // filter: to the server, a wait, then on
      const sPt = sp.getPointAtLength(s * sl);
      const fPt = fp.getPointAtLength(f * fl);
      slowDot.current!.setAttribute("transform", `translate(${sPt.x} ${sPt.y})`);
      fastDot.current!.setAttribute("transform", `translate(${fPt.x} ${fPt.y})`);
      slowTrail.current!.style.strokeDashoffset = `${sl * (1 - s)}`;
      fastTrail.current!.style.strokeDashoffset = `${fl * (1 - f)}`;
      slowEnd.current!.style.opacity = s > 0.995 ? "1" : "0";
      fastEnd.current!.style.opacity = f > 0.995 ? "1" : "0";
      server.current!.style.opacity = p >= 0.42 && p < 0.62 ? "1" : "0.55";
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [narrow]);

  const L = speed.lanes;
  // geometry: a narrower drawing on phones so the labels stay readable
  const VW = narrow ? 380 : 640;
  const a = narrow ? 24 : 60;
  const b = VW - a;
  const mid = VW / 2;
  const slow = `M ${a} 150 C ${a + (mid - a) * 0.42} 150, ${mid - (mid - a) * 0.46} 78, ${mid} 78 S ${b - (b - mid) * 0.42} 150, ${b} 150`;
  const fast = `M ${a} 350 L ${b} 350`;
  const t1 = narrow ? 17 : 15;
  const t2 = narrow ? 15 : 13;
  const lbl = { start: a - 6, end: b + 6 };

  return (
    <section ref={ref} id="speed" aria-labelledby="speed-title" className="relative overflow-hidden bg-night">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgb(4_99_239/0.10),transparent_70%)]" />
      <div className="wrap relative grid items-center gap-14 py-28 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20 md:py-48">
        <div className="max-w-[32rem]">
          <p className="act" data-reveal>
            Act III <span className="px-2 text-dim">/</span> Speed
          </p>
          <h2 id="speed-title" className="display display-xl mt-8 text-white" data-reveal-lines>
            <span className="line-mask">
              <span>Native speed.</span>
            </span>
            <span className="line-mask">
              <span className="text-aluminium/50" style={{ ["--d" as string]: "0.12s" }}>
                No proxy.
              </span>
            </span>
          </h2>
          <p className="lede mt-8 text-aluminium/70" data-reveal style={{ ["--d" as string]: "0.25s" }}>
            {speed.body}
          </p>
        </div>

        <figure className="relative" dir="ltr">
          <svg viewBox={`0 0 ${VW} 420`} className="h-auto w-full overflow-visible" role="img" aria-labelledby="speed-diagram-title">
            <title id="speed-diagram-title">A tablet with a filter routes traffic through a filter server before it reaches your apps. Bizmo connects directly.</title>
            <defs>
              <linearGradient id="spd-dot" gradientUnits="userSpaceOnUse" x1={a} y1="0" x2={b} y2="0">
                <stop offset="0" stopColor="#0463EF" />
                <stop offset="1" stopColor="#2DDAFF" />
              </linearGradient>
              <radialGradient id="spd-glow">
                <stop offset="0" stopColor="#2DDAFF" stopOpacity="0.55" />
                <stop offset="1" stopColor="#2DDAFF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* lane: tablet with a filter */}
            <text x={lbl.start} y="34" fontSize={t1} className="fill-mist">
              {L.filter.label}
            </text>
            <path ref={slowPath} d={slow} fill="none" stroke="rgb(228 230 233 / 0.14)" strokeWidth="1.5" strokeDasharray="3 6" />
            <path ref={slowTrail} d={slow} fill="none" stroke="rgb(228 230 233 / 0.55)" strokeWidth="1.5" />
            <g ref={server} style={{ transition: "opacity .4s" }}>
              <rect x={mid - 30} y="56" width="60" height="44" rx="8" fill="#171a1f" stroke="rgb(228 230 233 / 0.35)" />
              <line x1={mid - 18} y1="71" x2={mid + 18} y2="71" stroke="rgb(228 230 233 / 0.35)" />
              <line x1={mid - 18} y1="85" x2={mid + 10} y2="85" stroke="rgb(228 230 233 / 0.35)" />
              <text x={mid} y="128" textAnchor="middle" fontSize={t2 + 1} className="fill-aluminium">
                {L.filter.nodes[1]}
              </text>
            </g>
            <circle cx={a} cy="150" r="5" fill="rgb(228 230 233 / 0.7)" />
            <text x={lbl.start} y="182" fontSize={t2} className="fill-mist">
              {L.filter.nodes[0]}
            </text>
            <circle ref={slowEnd} cx={b} cy="150" r="14" fill="url(#spd-glow)" style={{ opacity: 0, transition: "opacity .5s" }} />
            <circle cx={b} cy="150" r="5" fill="rgb(228 230 233 / 0.7)" />
            <text x={lbl.end} y="182" textAnchor="end" fontSize={t2} className="fill-mist">
              {L.filter.nodes[2]}
            </text>
            <g ref={slowDot}>
              <circle r="12" fill="url(#spd-glow)" />
              <circle r="4.5" fill="#e4e6e9" />
            </g>

            <line x1={a - 6} y1="236" x2={b + 6} y2="236" stroke="rgb(228 230 233 / 0.07)" />

            {/* lane: Bizmo */}
            <text x={lbl.start} y="292" fontSize={t1} className="fill-white font-medium">
              {L.bizmo.label}
            </text>
            <path ref={fastPath} d={fast} fill="none" stroke="rgb(228 230 233 / 0.14)" strokeWidth="1.5" strokeDasharray="3 6" />
            <path ref={fastTrail} d={fast} fill="none" stroke="url(#spd-dot)" strokeWidth="2" />
            <circle cx={a} cy="350" r="5" fill="url(#spd-dot)" />
            <text x={lbl.start} y="382" fontSize={t2} className="fill-aluminium">
              {L.bizmo.nodes[0]}
            </text>
            <circle ref={fastEnd} cx={b} cy="350" r="16" fill="url(#spd-glow)" style={{ opacity: 0, transition: "opacity .5s" }} />
            <circle cx={b} cy="350" r="5" fill="url(#spd-dot)" />
            <text x={lbl.end} y="382" textAnchor="end" fontSize={t2} className="fill-aluminium">
              {L.bizmo.nodes[1]}
            </text>
            <g ref={fastDot}>
              <circle r="14" fill="url(#spd-glow)" />
              <circle r="5" fill="url(#spd-dot)" />
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
