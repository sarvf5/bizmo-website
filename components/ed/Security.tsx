import { ed } from "@/lib/content";

/* Four confirmed protections, each with a quiet line glyph drawn for this page. */
const GLYPHS: Record<string, React.ReactNode> = {
  "Secure boot": (
    <path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11l14-5Z M18 24l4.5 4.5L31 20" />
  ),
  "Locked bootloader": (
    <>
      <rect x="12" y="21" width="24" height="18" rx="4" />
      <path d="M17 21v-5a7 7 0 0 1 14 0v5 M24 28v4" />
    </>
  ),
  "Verified boot": (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M17 24.5l5 5 9-10" />
    </>
  ),
  "Full encryption": (
    <>
      <circle cx="18" cy="24" r="7" />
      <path d="M25 24h15 M35 24v6 M40 24v4" />
    </>
  ),
};

export default function Security() {
  return (
    <section id="security" data-surface="dark" aria-labelledby="sec-title" className="on-dark bg-night py-24 text-snow md:py-36">
      <div className="wrap text-center">
        <h2 id="sec-title" className="t-h1" data-reveal>
          {ed.security.title}
        </h2>
        <p className="t-intro mx-auto mt-5 max-w-[34rem] text-snow-2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
          {ed.security.sub}
        </p>
      </div>
      <div className="wrap-wide mt-14 md:mt-20">
        <ul className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {ed.security.items.map((it, i) => (
            <li key={it} className="tile flex aspect-[4/5] flex-col justify-between bg-night-2 p-5 md:p-8 max-lg:aspect-square" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
              <svg viewBox="0 0 48 48" className="h-10 w-10 text-[#2997ff] md:h-14 md:w-14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {GLYPHS[it]}
              </svg>
              <h3 className="t-h3 max-md:!text-[1.2rem]">{it}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
