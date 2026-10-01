import { footer, nav, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-night text-aluminium/70">
      <div className="wrap flex flex-col gap-10 border-t border-white/[0.07] py-14 md:flex-row md:items-end md:justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/bizmo-wordmark-white.svg" alt="Bizmo" className="h-7 w-auto" />
          <p className="mt-5 max-w-[24rem] text-[0.95rem]">{footer.line}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[0.92rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#notify" className="hover:text-white">
                Get notified
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrap flex flex-col gap-2 pb-10 text-[0.82rem] text-mist md:flex-row md:justify-between">
        <p>
          {footer.legal}. {site.category}.
        </p>
        <p>{footer.note}</p>
      </div>
    </footer>
  );
}
