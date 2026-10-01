"use client";

import { useEffect, useRef, useState } from "react";
import { daily } from "@/lib/content";

/*
  The studio render (screen off) with a live screen laid into it.
  Screen rectangle measured from the studio's colour mask for this view (RE9-1CC / RA1CC),
  relative to the cropped render: left 4.198%, top 6.534%, width 82.23%, height 87.11%.
  App names are text on neutral tiles: third-party icons and logos are never reproduced.
*/
const SCREEN = { left: "4.198%", top: "6.534%", width: "82.23%", height: "87.11%" };

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[42%] w-[42%]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.6 3.5h2.6l1.4 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.4v2.6a2 2 0 0 1-2 2A16.6 16.6 0 0 1 4.6 5.5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomeScreen() {
  const now = useNow();
  const stage = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  // the device leans towards the pointer
  useEffect(() => {
    const el = stage.current!;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      gx = 50,
      gy = 30,
      raf = 0,
      on = false;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      gx = ((e.clientX - r.left) / r.width) * 100;
      gy = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    function loop() {
      raf = 0;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      device.current!.style.transform = `rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) translateZ(0)`;
      glare.current!.style.background = `radial-gradient(60% 60% at ${gx}% ${gy}%, rgb(255 255 255 / 0.16), transparent 60%)`;
      on = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001;
      if (on) raf = requestAnimationFrame(loop);
    }
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const time = now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "") : "";
  const ampm = now ? (now.getHours() < 12 ? "AM" : "PM") : "";
  const date = now ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) : "";

  return (
    <section id="daily" aria-labelledby="daily-title" className="relative overflow-hidden bg-night py-32 md:py-48">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[30%] h-[60%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(242_167_116/0.16),rgb(4_99_239/0.08)_45%,transparent_75%)]" />
      <div className="wrap relative">
        <div className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end">
          <div>
            <p className="act" data-reveal>
              Act IV <span className="px-2 text-dim">/</span> Daily work
            </p>
            <h2 id="daily-title" className="display display-xl mt-8 text-white" data-reveal-lines>
              <span className="line-mask">
                <span>{daily.title[0]}</span>
              </span>
              <span className="line-mask">
                <span className="text-aluminium/50" style={{ ["--d" as string]: "0.12s" }}>
                  {daily.title[1]}
                </span>
              </span>
            </h2>
          </div>
          <p className="lede max-w-[28rem] text-aluminium/70 md:pb-3" data-reveal style={{ ["--d" as string]: "0.25s" }}>
            {daily.body}
          </p>
        </div>

        <div ref={stage} className="relative mx-auto mt-16 max-w-[1180px] [perspective:2200px] md:mt-24" data-reveal style={{ ["--d" as string]: "0.15s" }}>
          <div ref={device} className="relative transition-transform duration-[60ms] [transform-style:preserve-3d]" data-cursor="Approved">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/renders/front-off.webp" alt="Bizmo tablet showing an illustrative home screen with approved business apps" className="relative block w-full select-none" draggable={false} />

            <div className="absolute overflow-hidden rounded-[0.6%] [container-type:size]" style={SCREEN}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/wallpaper.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(8_10_14/0.55),rgb(8_10_14/0.1)_55%,rgb(8_10_14/0.25))]" />

              {/* status bar */}
              <div className="absolute inset-x-[2.4cqw] top-[2.2cqh] flex items-center justify-between font-mono text-[1.5cqw] text-white/90">
                <span>{time}</span>
                <span className="flex items-center gap-[1cqw]">
                  <span>4G</span>
                  <svg viewBox="0 0 24 24" className="h-[2.2cqw] w-[2.2cqw]" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" strokeLinecap="round" />
                    <circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </div>

              {/* clock */}
              <div className="absolute start-[5cqw] top-[16cqh] text-white">
                <p className="font-display text-[13cqw] leading-[0.85] font-light tracking-[-0.03em]">
                  {time || " "}
                  <span className="ms-[1cqw] align-top font-sans text-[2.2cqw] font-normal tracking-normal text-white/80">{ampm}</span>
                </p>
                <p className="mt-[2cqh] text-[2.1cqw] text-white/85">{date}</p>
              </div>

              {/* apps */}
              <ul className="absolute end-[4cqw] top-[15cqh] grid grid-cols-4 gap-x-[2.6cqw] gap-y-[4.5cqh]">
                {daily.apps.map((a) => (
                  <li key={a.name} className="group flex w-[8.6cqw] flex-col items-center">
                    <span className="grid aspect-square w-full place-items-center rounded-[22%] border border-white/25 bg-white/[0.14] font-display text-[3.6cqw] text-white shadow-[0_0.8cqw_2cqw_rgb(0_0_0/0.25)] backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-[0.6cqh] group-hover:bg-white/25">
                      {a.name === "Phone" ? <PhoneGlyph /> : a.short}
                    </span>
                    <span className="mt-[1cqh] w-[130%] truncate text-center text-[1.35cqw] text-white/95 [text-shadow:0_1px_4px_rgb(0_0_0/0.5)]">{a.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div ref={glare} aria-hidden="true" className="pointer-events-none absolute mix-blend-overlay" style={SCREEN} />
          </div>
          <div aria-hidden="true" className="mx-auto -mt-2 h-10 w-[70%] rounded-[50%] bg-black/70 blur-2xl" />
        </div>
        <p className="mt-8 text-center text-[0.8rem] text-dim">{daily.caption}</p>
      </div>
    </section>
  );
}
