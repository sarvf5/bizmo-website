"use client";

import { useEffect, useState } from "react";
import { ed } from "@/lib/content";

/**
 * Apple-style product bar: translucent, sticky, 52px. Wordmark on the start side,
 * section links and the one call to action on the end side. Turns dark over the black film.
 */
export default function LocalNav() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 8);
      // dark when a black section sits under the bar
      const el = document.elementsFromPoint(innerWidth / 2, 30).find((n) => n.closest("[data-surface]"));
      setDark(el?.closest("[data-surface]")?.getAttribute("data-surface") === "dark");
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
        dark ? "border-b border-white/10 bg-black/70 text-snow backdrop-blur-xl backdrop-saturate-150" : `bg-white/72 text-ink backdrop-blur-xl backdrop-saturate-[1.8] ${scrolled ? "border-b border-black/[0.08]" : "border-b border-transparent"}`
      }`}
    >
      <div className="wrap-wide flex h-[52px] items-center justify-between gap-6">
        <a href="#top" aria-label="Bizmo, back to top" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dark ? "/brand/bizmo-wordmark-white.svg" : "/brand/bizmo-wordmark.svg"} alt="" className="h-[19px] w-auto" />
        </a>
        <nav aria-label="Main" className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {ed.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className={`t-small transition-opacity hover:opacity-100 ${dark ? "text-snow/80" : "text-ink/80"}`}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#notify" className="btn btn-blue btn-sm">
            {ed.cta}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="relative grid h-8 w-8 place-items-center md:hidden"
          >
            <span className={`absolute h-[1.5px] w-[15px] rounded bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3.5px]"}`} />
            <span className={`absolute h-[1.5px] w-[15px] rounded bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3.5px]"}`} />
          </button>
        </nav>
      </div>
      <div className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[var(--ease-apple)] md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <ul className="min-h-0 px-[22px]">
          {ed.nav.map((n, i) => (
            <li key={n.href} className={`border-t border-current/10 transition-[opacity,transform] duration-500 ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`} style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}>
              <a href={n.href} onClick={() => setOpen(false)} className="block py-3 text-[17px] font-semibold">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
