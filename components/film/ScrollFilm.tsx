"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FrameStore,
  STAGE,
  pointer,
  trackPointer,
  clamp01,
  drawFrame,
  feather,
  lerp,
  loadManifest,
  placement,
  project,
  smooth,
  type ClipId,
  type Manifest,
  type View,
  type timeline,
} from "@/lib/film/engine";

export type Copy = {
  id: string;
  in: number; // scroll position (viewport heights) where it fades in; < 0 = visible from the start
  out: number; // where it fades out; Infinity = stays
  className: string; // placement on desktop (mobile placement is shared)
  still: string; // still used by the reduced-motion layout, e.g. "explode-last"
  node: ReactNode;
};

export type Callout = {
  id: string;
  u: number; // anchor in frame space (0..1)
  v: number;
  side: "left" | "right";
  reach: number; // line length as a fraction of viewport width
  in: number;
  out: number;
  label: string;
  sub?: string;
};

export type FilmProps = {
  id: string;
  label: string;
  clips: ClipId[];
  tl: ReturnType<typeof timeline>;
  copy: Copy[];
  callouts?: Callout[];
  /** extra scroll (viewport heights) after the last beat before the section unpins */
  tail?: number;
  scrim?: "start" | "both" | "strong" | "none";
  /** warm light from the screen spilling into the room, faded out by this scroll position */
  glow?: { until: number };
};

const FADE = 0.32;
const opacityAt = (pos: number, a: number, b: number) =>
  Math.min(a < 0 ? 1 : smooth((pos - a) / FADE), b === Infinity ? 1 : smooth((b - pos) / FADE));

export default function ScrollFilm(props: FilmProps) {
  const [mode, setMode] = useState<"film" | "static">("film");
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const q = new URLSearchParams(location.search).get("motion");
    const set = () => setMode(mq.matches || q === "off" ? "static" : "film");
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return mode === "static" ? <StaticFilm {...props} /> : <PinnedFilm {...props} />;
}

/* ================================================================== pinned film */

function PinnedFilm({ id, label, clips, tl, copy, callouts = [], tail = 0.6, scrim = "start", glow }: FilmProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const copyEls = new Map<string, HTMLElement>();
    stage.querySelectorAll<HTMLElement>("[data-copy]").forEach((el) => copyEls.set(el.dataset.copy!, el));
    const calloutEls = new Map<string, HTMLElement>();
    stage.querySelectorAll<HTMLElement>("[data-callout]").forEach((el) => calloutEls.set(el.dataset.callout!, el));

    let view: View = { W: 1, H: 1, mobile: false };
    let dpr = 1;
    let store: FrameStore | null = null;
    let m: Manifest | null = null;
    let raf = 0;
    let inView = false;
    let alive = true;
    let started = false;
    let setName: "lg" | "sm" = "lg";
    let steer = 0.05; // smoothed pointer-driven position for "mouse" layers
    trackPointer();

    const resize = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      view = { W, H, mobile: W < 768 && H > W };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      kick();
    };

    const ensureStore = () => {
      if (started || !m) return;
      started = true;
      setName = view.W < 700 ? "sm" : "lg";
      store = new FrameStore(m, setName, clips);
      store.start();
    };

    loadManifest().then((man) => {
      if (!alive || !man) return;
      m = man;
      if (inView || nearView) ensureStore();
      kick();
    });

    const pos = () => -section.getBoundingClientRect().top / Math.max(stage.clientHeight, 1);

    function render(now: number) {
      raf = 0;
      if (!alive) return;
      const p = pos();
      const { W, H } = view;
      const at = tl.at(p);
      const { beat, k } = at;
      let cam = at.cam;
      if (beat.parallax && !view.mobile) cam = { x: cam.x + (pointer.x - 0.5) * 0.018, y: cam.y + (pointer.y - 0.5) * 0.026, s: cam.s };
      // the pointer turns the device: left of the screen faces you, moving right turns it towards its edge
      const idle = now - pointer.moved > 2200;
      const steerTarget = idle ? 0.05 + 0.05 * Math.sin(now / 1700) : 0.34 * smooth((pointer.x - 0.22) / 0.72);
      steer += (steerTarget - steer) * (idle ? 0.03 : 0.085);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = STAGE;
      ctx.fillRect(0, 0, W, H);

      let place: ReturnType<typeof placement> | null = null;
      if (store && m) {
        const fw = m.sets[setName];
        const fh = Math.round((fw * 9) / 16);
        place = placement(view, fw, fh, cam);
        for (const L of beat.layers) {
          const n = store.count(L.clip);
          let t: number;
          if (L.t0 === "loop") {
            const dur = n / m.fps;
            t = ((now / 1000) % dur) / dur;
          } else if (L.t0 === "mouse") t = lerp(steer, L.t1 ?? steer, k);
          else t = lerp(L.t0, L.t1 ?? L.t0, k);
          const i = Math.round(clamp01(t) * (n - 1));
          store.want(L.clip, i);
          const img = store.get(L.clip, i);
          const a = lerp(L.a0 ?? 1, L.a1 ?? L.a0 ?? 1, k);
          if (img) drawFrame(ctx, img, place, a);
        }
        feather(ctx, place, W, H);
      }

      if (glow && glowRef.current) {
        const g = glowRef.current;
        const o = place ? 1 - smooth(p / glow.until) : 0;
        g.style.opacity = (o * 0.62).toFixed(3);
        if (place && o > 0.01) {
          const c = project(place, 0.5, 0.47);
          const w = place.dw * 0.62;
          g.style.width = `${w}px`;
          g.style.height = `${w * 0.62}px`;
          g.style.transform = `translate3d(${(c.x - w / 2).toFixed(1)}px, ${(c.y - w * 0.31).toFixed(1)}px, 0)`;
        }
      }

      // copy
      for (const c of copy) {
        const el = copyEls.get(c.id);
        if (!el) continue;
        const o = opacityAt(p, c.in, c.out);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        const inert = o < 0.5;
        if (el.inert !== inert) el.inert = inert;
        if (o > 0.01)
          el.querySelectorAll<HTMLElement>("[data-reveal-at]").forEach((r) => {
            const ro = smooth((p - Number(r.dataset.revealAt)) / 0.25);
            r.style.opacity = (0.18 + 0.82 * ro).toFixed(3);
            r.style.transform = `translate3d(${((1 - ro) * -10).toFixed(1)}px, 0, 0)`;
          });
      }

      // callouts follow the virtual camera
      for (const c of callouts) {
        const el = calloutEls.get(c.id);
        if (!el) continue;
        const o = view.mobile || !place ? 0 : opacityAt(p, c.in, c.out);
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        if (o < 0.01 || !place) continue;
        const pt = project(place, c.u, c.v);
        const shift = c.side === "left" ? "-100%" : "0%";
        el.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) translate(${shift}, -50%)`;
        const line = el.querySelector<HTMLElement>(".callout-line");
        if (line) {
          line.style.width = `${Math.round(c.reach * W)}px`;
          line.style.transform = `scaleX(${smooth(o * 1.2).toFixed(3)})`;
        }
      }

      if (progressRef.current) progressRef.current.style.transform = `scaleX(${clamp01(p / tl.total).toFixed(4)})`;

      if (inView) raf = requestAnimationFrame(render);
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(render);
    }

    let nearView = false;
    const near = new IntersectionObserver(
      ([e]) => {
        nearView = e.isIntersecting;
        if (nearView) ensureStore();
      },
      { rootMargin: "150% 0px 150% 0px" },
    );
    near.observe(section);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) {
        ensureStore();
        kick();
      }
    });
    io.observe(section);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      near.disconnect();
      io.disconnect();
      ro.disconnect();
      store?.destroy();
    };
  }, [clips, tl, copy, callouts]);

  return (
    <section ref={sectionRef} id={id} aria-label={label} className="on-dark relative bg-night text-snow" style={{ height: `${(tl.total + tail) * 100}svh` }}>
      <div ref={stageRef} className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        {glow && (
          <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 opacity-0 mix-blend-screen">
            {/* the official wallpaper, blurred into light; masked so it surrounds the device rather than covering it */}
            <div
              className="absolute -inset-[55%] bg-[url('/brand/wallpaper-glow.webp')] bg-cover bg-center blur-[110px] saturate-[1.3] [mask-image:radial-gradient(closest-side,transparent_30%,rgb(0_0_0/0.85)_62%,transparent_100%)]"
            />
          </div>
        )}

        {scrim !== "none" && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className={`absolute inset-y-0 start-0 hidden md:block ${
                scrim === "strong"
                  ? "w-[68%] bg-[linear-gradient(to_right,rgb(0_0_0/0.96),rgb(0_0_0/0.82)_40%,transparent)] rtl:bg-[linear-gradient(to_left,rgb(0_0_0/0.96),rgb(0_0_0/0.82)_40%,transparent)]"
                  : "w-[52%] bg-[linear-gradient(to_right,rgb(0_0_0/0.88),rgb(0_0_0/0.55)_45%,transparent)] rtl:bg-[linear-gradient(to_left,rgb(0_0_0/0.88),rgb(0_0_0/0.55)_45%,transparent)]"
              }`}
            />
            {scrim === "both" && <div className="absolute inset-y-0 end-0 hidden w-[40%] bg-[linear-gradient(to_left,rgb(0_0_0/0.8),transparent)] md:block" />}
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,rgb(0_0_0/0.97)_30%,rgb(0_0_0/0.6)_65%,transparent)] md:h-40 md:bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent)]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.7),transparent)]" />
          </div>
        )}

        {callouts.map((c) => (
          <div key={c.id} data-callout={c.id} aria-hidden="true" dir="ltr" className="callout">
            <div className={`flex items-center ${c.side === "left" ? "flex-row" : "flex-row-reverse"}`}>
              <div className={`[text-shadow:0_1px_12px_rgb(0_0_0/0.9)] ${c.side === "left" ? "pr-4 text-right" : "pl-4 text-left"}`}>
                <p className="text-[0.95rem] leading-tight font-medium whitespace-nowrap text-snow">{c.label}</p>
                {c.sub && <p className={`mt-1 max-w-[15rem] text-[0.8rem] leading-snug text-snow-2 ${c.side === "left" ? "ms-auto" : ""}`}>{c.sub}</p>}
              </div>
              <div
                className="callout-line"
                style={{ ["--to" as string]: c.side === "left" ? "left" : "right", ["--origin" as string]: c.side === "left" ? "right" : "left" }}
              />
              <div className="callout-dot shrink-0" />
            </div>
          </div>
        ))}

        <div className="absolute inset-0">
          {copy.map((c) => (
            <div key={c.id} data-copy={c.id} className={`film-copy max-md:inset-x-5 max-md:bottom-[max(2.25rem,env(safe-area-inset-bottom))] ${c.className}`}>
              {c.node}
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]">
          <div ref={progressRef} className="h-full origin-left bg-snow/40 rtl:origin-right" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== reduced motion */

function StaticFilm({ id, label, copy, callouts = [] }: FilmProps) {
  return (
    <section id={id} aria-label={label} className="static-film on-dark bg-night py-20 text-snow md:py-28">
      <div className="wrap flex flex-col gap-20 md:gap-28">
        {copy.map((c) => {
          const notes = callouts.filter((k) => k.in >= c.in - 0.01 && k.in < c.out);
          return (
            <div key={c.id} className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
              <div className="max-w-xl">
                {c.node}
                {notes.length > 0 && (
                  <ul className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-[0.95rem]">
                    {notes.map((n) => (
                      <li key={n.id}>
                        <span className="text-snow">{n.label}</span>
                        {n.sub && <span className="text-snow-2">, {n.sub}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/film/stills/${c.still}.webp`} alt="" loading="lazy" className="w-full rounded-[1.25rem]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
