"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

/** Quiet top bar. Steps out of the way while you scroll down; returns when you scroll up. */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setSolid(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > innerHeight * 0.9);
        last = y;
      }
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden ? "-translate-y-full" : ""} ${
        solid ? "bg-night/40 backdrop-blur-xl" : ""
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-20">
        <a href="#top" className="block shrink-0" aria-label="Bizmo, back to top" data-cursor="Top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/bizmo-wordmark-white.svg" alt="" className="h-[22px] w-auto md:h-[25px]" />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-10 font-mono text-[0.66rem] tracking-[0.22em] text-aluminium/60 uppercase">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors duration-300 hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#notify" className="btn btn-ghost min-h-10 px-5 text-[0.85rem]" data-cursor="Notify">
          Get notified
        </a>
      </div>
    </header>
  );
}
