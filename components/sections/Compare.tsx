import { compare } from "@/lib/content";

export default function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="relative bg-night py-28 md:py-44">
      <div className="wrap">
        <p className="act" data-reveal>
          Act VII <span className="px-2 text-dim">/</span> Compare
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-16">
          <h2 id="compare-title" className="display display-lg text-white" data-reveal-lines>
            <span className="line-mask">
              <span>One device instead of</span>
            </span>
            <span className="line-mask">
              <span className="text-aluminium/50" style={{ ["--d" as string]: "0.12s" }}>
                a tablet and a filter.
              </span>
            </span>
          </h2>
          <p className="lede max-w-[28rem] text-aluminium/70" data-reveal>
            {compare.body}
          </p>
        </div>

        <dl className="mt-12 border-t border-white/10 md:hidden">
          {compare.rows.map(([k, a, b]) => (
            <div key={k} className="border-b border-white/10 py-5">
              <dt className="act">{k}</dt>
              <dd className="mt-2 font-display text-[1.45rem] leading-snug font-light text-white">
                <span className="sr-only">Bizmo: </span>
                {b}
              </dd>
              <dd className="mt-1.5 text-[0.92rem] text-mist">
                <span className="text-aluminium/60">With a filter: </span>
                {a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="relative mt-20 hidden md:block" data-reveal>
          {/* the Bizmo column is lit from within */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 w-[39%] rounded-[1.5rem] bg-[linear-gradient(180deg,rgb(4_99_239/0.12),rgb(45_218_255/0.03))] ring-1 ring-cyan/15" />
          <table className="relative w-full border-collapse text-start">
            <caption className="sr-only">A normal tablet with a filter compared with Bizmo</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[22%] py-7 pe-6 text-start">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="act w-[39%] py-7 pe-6 text-start font-normal">
                  {compare.head[1]}
                </th>
                <th scope="col" className="w-[39%] px-8 py-7 text-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/bizmo-wordmark-white.svg" alt="Bizmo" className="h-6 w-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map(([k, a, b]) => (
                <tr key={k} className="border-t border-white/[0.08] align-top">
                  <th scope="row" className="act py-7 pe-6 text-start font-normal">
                    {k}
                  </th>
                  <td className="py-7 pe-6 text-[1.02rem] text-mist">{a}</td>
                  <td className="px-8 py-7 font-display text-[1.55rem] leading-snug font-light text-white">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
