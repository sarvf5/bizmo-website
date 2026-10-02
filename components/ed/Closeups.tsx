import { ed } from "@/lib/content";

export default function Closeups() {
  const c = ed.closeups;
  return (
    <section id="details" data-surface="light" aria-label="Camera, display and connectivity" className="bg-white py-24 md:py-36">
      <div className="wrap-wide">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-2">
          <article className="tile flex min-h-[560px] flex-col bg-[#111] text-snow md:min-h-[680px]" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/apple/camera-macro.webp" alt="Close-up of the Bizmo rear camera" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover object-[55%_70%] brightness-[0.92]" />
            <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-black/55 to-transparent" />
            <div className="p-8 md:p-12">
              <h3 className="t-h2">{c.camera.title}</h3>
              <p className="t-intro mt-3 max-w-[22rem] text-snow/80">{c.camera.sub}</p>
            </div>
          </article>
          <article className="tile flex min-h-[560px] flex-col bg-canvas md:min-h-[680px]" data-reveal style={{ ["--d" as string]: "0.08s" }}>
            <div className="p-8 md:p-12">
              <h3 className="t-h2">
                <span className="block">{c.display.title}</span>
                <span className="block text-ink-3">{c.display.titleB}</span>
              </h3>
            </div>
            <div className="mt-auto ps-8 md:ps-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apple/front.webp" alt="Bizmo display showing the official wallpaper" loading="lazy" className="block w-[125%] max-w-none translate-y-[6%]" />
            </div>
          </article>
          <article className="tile flex flex-col gap-10 bg-canvas p-8 md:col-span-2 md:p-12" data-reveal>
            <div className="max-w-[36rem]">
              <h3 className="t-h2">{c.connect.title}</h3>
              <p className="t-intro mt-3 text-ink-2">{c.connect.sub}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/apple/edge.webp" alt="Bizmo seen edge-on, showing its side profile and port" loading="lazy" className="block w-full" />
          </article>
        </div>
      </div>
    </section>
  );
}
