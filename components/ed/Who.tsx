import { ed } from "@/lib/content";

export default function Who() {
  return (
    <section id="who" data-surface="light" aria-labelledby="who-title" className="bg-canvas py-24 md:py-36">
      <div className="wrap grid items-center gap-14 md:grid-cols-2 md:gap-10">
        <div>
          <h2 id="who-title" className="t-h2" data-reveal>
            {ed.who.title}
          </h2>
          <p className="t-intro mt-6 max-w-[30rem]" data-reveal style={{ ["--d" as string]: "0.08s" }}>
            <span className="text-ink">{ed.who.lead}</span> <span className="text-ink-2">{ed.who.rest}</span>
          </p>
        </div>
        <div data-reveal style={{ ["--d" as string]: "0.12s" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apple/front-back.webp"
            alt="Bizmo, front and back"
            loading="lazy"
            className="mx-auto w-[min(100%,30rem)] drop-shadow-[0_40px_50px_rgb(0_0_0/0.16)]"
          />
        </div>
      </div>
    </section>
  );
}
