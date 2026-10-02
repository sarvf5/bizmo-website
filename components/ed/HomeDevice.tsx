"use client";

import { useEffect, useState } from "react";
import { daily } from "@/lib/content";

/*
  The studio render (screen off) with a live home screen laid into the glass.
  Screen rectangle measured from the studio's colour mask for this view (RE9-1CC / RA1CC).
  App names are text on neutral tiles: third-party icons and logos are never reproduced.
*/
const SCREEN = { left: "4.198%", top: "6.534%", width: "82.23%", height: "87.11%" };

export default function HomeDevice({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  const time = now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "") : "";
  const date = now ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) : "";

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/apple/front-off.webp" alt="" className="relative block w-full select-none" draggable={false} />
      <div className="absolute overflow-hidden rounded-[0.6%] [container-type:size]" style={SCREEN}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/wallpaper.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.45),rgb(0_0_0/0.05)_55%,rgb(0_0_0/0.18))]" />
        <div className="absolute inset-x-[2.4cqw] top-[2.4cqh] flex justify-between text-[1.6cqw] font-semibold text-white">
          <span>{time}</span>
          <span>4G</span>
        </div>
        <div className="absolute start-[5cqw] top-[16cqh] text-white">
          <p className="text-[12cqw] leading-[0.9] font-semibold tracking-[-0.04em]">{time || " "}</p>
          <p className="mt-[2cqh] text-[2.2cqw] font-medium text-white/90">{date}</p>
        </div>
        <ul className="absolute end-[4cqw] top-[15cqh] grid grid-cols-4 gap-x-[2.6cqw] gap-y-[4.4cqh]">
          {daily.apps.map((a) => (
            <li key={a.name} className="flex w-[8.6cqw] flex-col items-center">
              <span className="grid aspect-square w-full place-items-center rounded-[24%] bg-white/85 text-[3.6cqw] font-semibold text-ink shadow-[0_0.6cqw_1.6cqw_rgb(0_0_0/0.18)]">
                {a.name === "Phone" ? (
                  <svg viewBox="0 0 24 24" className="h-[45%] w-[45%] text-[#1f9d55]" fill="currentColor" aria-hidden="true">
                    <path d="M6.6 3.5h2.6l1.4 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.4v2.6a2 2 0 0 1-2 2A16.6 16.6 0 0 1 4.6 5.5a2 2 0 0 1 2-2Z" />
                  </svg>
                ) : (
                  a.short
                )}
              </span>
              <span className="mt-[1cqh] w-[130%] truncate text-center text-[1.4cqw] font-medium text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.45)]">{a.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
