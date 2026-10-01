import { audience } from "@/lib/content";

export default function Audience() {
  return (
    <section id="who" aria-labelledby="who-title" className="relative overflow-hidden bg-night py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute end-[-10%] top-[10%] h-[80%] w-[60%] bg-[radial-gradient(closest-side,rgb(242_167_116/0.14),rgb(4_99_239/0.06)_55%,transparent)]" />
      <div className="wrap relative grid items-center gap-16 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:gap-10">
        <div className="max-w-[36rem]">
          <p className="act" data-reveal>
            For you
          </p>
          <h2 id="who-title" className="display display-lg mt-8 text-white" data-reveal-lines>
            <span className="line-mask">
              <span>For people who already</span>
            </span>
            <span className="line-mask">
              <span className="text-aluminium/50" style={{ ["--d" as string]: "0.12s" }}>
                work on a tablet.
              </span>
            </span>
          </h2>
          <p className="lede mt-8 text-aluminium/70" data-reveal>
            {audience.body}
          </p>
          <ul className="mt-12 grid grid-cols-2 border-t border-white/10">
            {audience.roles.map((r, i) => (
              <li key={r} className="border-b border-white/10 py-4 pe-4 font-display text-[1.3rem] font-light text-aluminium" data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-[36rem]" data-reveal style={{ ["--d" as string]: "0.2s" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/renders/front-back.webp"
            alt="Bizmo tablet, front and back. The screen shows the official beach wallpaper; the back carries the engraved bizmo logo."
            loading="lazy"
            className="relative w-full drop-shadow-[0_50px_60px_rgb(0_0_0/0.6)]"
          />
        </div>
      </div>
    </section>
  );
}
