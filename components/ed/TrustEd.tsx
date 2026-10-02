import { ed } from "@/lib/content";

export default function TrustEd() {
  return (
    <section id="trust" data-surface="light" aria-labelledby="trust-title" className="bg-canvas py-24 md:py-36">
      <div className="wrap text-center">
        <h2 id="trust-title" className="t-h1" data-reveal>
          <span className="block">{ed.trust.title}</span>
          <span className="block text-ink-3">{ed.trust.titleB}</span>
        </h2>
        <p className="t-intro mx-auto mt-6 max-w-[34rem] text-ink-2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
          {ed.trust.sub}
        </p>
      </div>
      <div className="wrap-wide mt-14 md:mt-20">
        <div className="tile mx-auto aspect-[16/9] max-w-[1180px] bg-[#d9d9db] max-md:aspect-[4/5]" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/apple/logo-macro.webp" alt="The bizmo logo engraved into the aluminium back" loading="lazy" className="h-full w-full object-cover object-[50%_45%]" />
        </div>
      </div>
    </section>
  );
}
