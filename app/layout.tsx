import type { Metadata, Viewport } from "next";
import "./globals.css";
import { hero, site } from "@/lib/content";

// Until launch the site is a private preview: set ALLOW_INDEXING=1 on bizmousa.com to let search engines in.
const indexable = process.env.ALLOW_INDEXING === "1";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: `${site.name}, the kosher business tablet`,
  description: hero.lead,
  robots: indexable ? undefined : { index: false, follow: false },
  openGraph: {
    title: `${site.name}. ${site.oneLine}`,
    description: site.tagline,
    images: ["/apple/front.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // dir="rtl" (with lang="yi" or "he") mirrors the layout for the planned Yiddish/Hebrew version.
  return (
    <html lang="en" dir="ltr">
      <body id="top">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
