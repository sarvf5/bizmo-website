import { apps, ed } from "@/lib/content";

/* Eight categories, eight tiles; the biggest category gets the biggest tile. */
const LAYOUT: Record<string, string> = {
  finance: "lg:col-span-2 lg:row-span-2",
  work: "lg:col-span-2",
  pay: "",
  talk: "",
  security: "",
  building: "",
  travel: "",
  more: "",
};

export default function AppsBento() {
  return (
    <section id="apps" data-surface="light" aria-labelledby="apps-title" className="bg-canvas py-24 md:py-36">
      <div className="wrap text-center">
        <h2 id="apps-title" className="t-h1" data-reveal>
          {ed.apps.title}
        </h2>
        <p className="t-intro mx-auto mt-5 max-w-[40rem] text-ink-2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
          {ed.apps.sub}
        </p>
      </div>

      <div className="wrap-wide mt-14 md:mt-20">
        <ul className="mx-auto grid max-w-[1180px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(15rem,auto))]">
          {apps.categories.map((c, i) => {
            const big = c.id === "finance";
            return (
              <li key={c.id} className={`tile flex flex-col bg-white p-7 md:p-8 ${LAYOUT[c.id]}`} data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.06}s` }}>
                <p className={`t-grad font-semibold tracking-[-0.04em] tabular-nums ${big ? "text-[clamp(5rem,9vw,8.5rem)] leading-[0.9]" : "text-[3.5rem] leading-none"}`}>{c.count}</p>
                <h3 className={`mt-3 font-semibold tracking-[-0.02em] ${big ? "text-[1.75rem] leading-tight" : "text-[1.0625rem]"}`}>{c.name}</h3>
                <p className={`mt-auto pt-6 text-ink-2 ${big ? "text-[1.0625rem] leading-relaxed" : "text-[0.9375rem] leading-snug"}`}>
                  {(big ? c.apps.slice(0, 14) : c.apps.slice(0, c.id === "work" ? 8 : 4)).join(", ")}
                  {big || c.id === "work" ? " and more." : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap mt-24 text-center md:mt-32">
        <p className="t-h2" data-reveal>
          {ed.apps.notLead}
        </p>
        <ul className="mx-auto mt-6 flex max-w-[52rem] flex-wrap justify-center gap-x-5 gap-y-1 t-h3 !font-semibold text-ink-3" aria-label="Not on Bizmo" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          {ed.apps.not.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="t-small mx-auto mt-10 max-w-[36rem] text-ink-3">{apps.note}</p>
      </div>
    </section>
  );
}
