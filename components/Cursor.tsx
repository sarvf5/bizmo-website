"use client";

import { useEffect, useRef } from "react";

/**
 * A ring that trails the pointer with the Bizmo dot at its centre.
 * Over anything interactive it opens up; elements can name the action with data-cursor="Turn".
 * Only on fine pointers (mouse, trackpad); touch screens keep their normal behaviour.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y,
      shown = false,
      raf = 0,
      big = false;

    const update = (target: Element | null) => {
      const t = target?.closest?.("a, button, [role='tab'], input, label, [data-cursor]") as HTMLElement | null;
      const text = t?.dataset.cursor ?? "";
      const nextBig = !!t && !(t instanceof HTMLInputElement);
      if (nextBig !== big || label.current!.textContent !== text) {
        big = nextBig;
        ring.current!.dataset.big = String(big);
        ring.current!.dataset.label = String(!!text);
        label.current!.textContent = text;
      }
    };
    // scrolling moves the page under a still pointer, so look again after each scroll
    let scrollRaf = 0;
    const onScroll = () => {
      if (!shown || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        update(document.elementFromPoint(x, y));
      });
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        ring.current!.style.opacity = "1";
        dot.current!.style.opacity = "1";
      }
      update(e.target as Element | null);
    };
    const leave = () => {
      shown = false;
      ring.current!.style.opacity = "0";
      dot.current!.style.opacity = "0";
    };
    const down = () => ring.current!.style.setProperty("--press", "0.86");
    const up = () => ring.current!.style.setProperty("--press", "1");

    const loop = () => {
      const k = reduced ? 1 : 0.17;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      ring.current!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div ref={ring} className="cursor-ring absolute top-0 left-0 opacity-0 transition-opacity duration-300" data-big="false" data-label="false">
        <div className="cursor-ring-inner">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="absolute top-0 left-0 opacity-0 transition-opacity duration-300">
        <div className="-mt-[3px] -ml-[3px] h-[6px] w-[6px] rounded-full bg-gradient-to-tr from-cobalt to-cyan shadow-[0_0_10px_rgb(45_218_255/0.9)]" />
      </div>
    </div>
  );
}
