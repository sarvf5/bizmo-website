import { compare, ed } from "@/lib/content";

function GenericTablet() {
  // a plain outline, deliberately not a Bizmo
  return (
    <svg viewBox="0 0 160 112" className="h-24 w-auto text-ink-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="6" y="6" width="148" height="100" rx="12" />
      <rect x="16" y="16" width="128" height="80" rx="4" strokeDasharray="3 5" />
    </svg>
  );
}

export default function CompareEd() {
  return (
    <section id="compare" data-surface="light" aria-labelledby="cmp-title" className="bg-white py-24 md:py-36">
      <div className="wrap text-center">
        <h2 id="cmp-title" className="t-h1 mx-auto max-w-[48rem]" data-reveal>
          {ed.compare.title}
        </h2>
      </div>
      <div className="wrap mt-14 md:mt-20">
        <div className="grid grid-cols-2 gap-4 md:gap-6" data-reveal>
          {[
            { key: "left", name: ed.compare.left, col: 1 },
            { key: "right", name: ed.compare.right, col: 2 },
          ].map((side) => (
            <div key={side.key} className={`tile flex flex-col items-center px-4 pt-10 pb-4 text-center md:px-10 ${side.col === 2 ? "bg-canvas" : "bg-white ring-1 ring-hair/70"}`}>
              <div className="flex h-28 items-end">
                {side.col === 2 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/apple/front.webp" alt="Bizmo" className="h-28 w-auto drop-shadow-[0_14px_18px_rgb(0_0_0/0.15)]" loading="lazy" />
                ) : (
                  <GenericTablet />
                )}
              </div>
              <h3 className="mt-6 text-[21px] font-semibold tracking-[-0.02em] md:text-[24px]">{side.name}</h3>
              <ul className="mt-6 w-full">
                {compare.rows.map(([k, a, b]) => (
                  <li key={k} className="border-t border-hair/80 py-5">
                    <span className="t-small block text-ink-3">{k}</span>
                    <span className={`mt-1 block text-[15px] leading-snug md:text-[17px] ${side.col === 2 ? "font-medium text-ink" : "text-ink-2"}`}>{side.col === 2 ? b : a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
