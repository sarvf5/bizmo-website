import { daily, ed, footer, site } from "@/lib/content";

export default function FooterEd() {
  return (
    <footer data-surface="light" className="bg-canvas text-ink-2">
      <div className="wrap t-small py-5">
        <p className="border-b border-hair pb-4 text-ink-3">{daily.caption} {footer.note}</p>
        <nav aria-label="Footer" className="border-b border-hair py-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {ed.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-ink hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-1 pt-4 md:flex-row md:justify-between">
          <p>{footer.legal}. All rights reserved.</p>
          <p>{site.category}</p>
        </div>
      </div>
    </footer>
  );
}
