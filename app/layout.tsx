import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import LocaleSwitcher from "./locale-switcher";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.metadata.title, template: `%s | ${t.metadata.title}` },
    description: t.metadata.description,
    keywords: [
      "LOL",
      "League of Legends",
      "diagnosis",
      "personality test",
      "champion",
      "MBTI",
      "診断",
      "キャラタイプ",
      "性格診断",
      "チャンピオン",
    ],
    alternates: {
      canonical: "/",
      languages: { ja: "/", en: "/", "x-default": "/" },
    },
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.ogDescription,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      siteName: t.metadata.title,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    verification: { google: "hHdNAnGirkxFJ9QvjPGe6o1exoJVEAYuDEUaQPRxvS8" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = dict(locale);
  return (
    <html lang={locale}>
      <body>
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-[var(--font-display)] text-base font-semibold tracking-wide text-(--color-accent) md:text-lg"
            >
              <span className="truncate">{t.siteName}</span>
              <span className="rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] font-normal text-(--color-text-muted)">
                {t.unofficial}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LocaleSwitcher current={locale} />
              <span className="hidden text-xs text-(--color-text-muted) md:inline">{t.version}</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{children}</main>
        <footer className="border-t border-white/10 py-6 text-xs text-(--color-text-muted)">
          <div className="mx-auto max-w-3xl space-y-2 px-4 text-center leading-relaxed">
            <p>
              <strong className="text-(--color-text)">{t.siteName}</strong>
              {t.legal.disclaimerSuffix}
            </p>
            <p>{t.legal.trademark}</p>
            <p className="text-[10px] opacity-60">
              {t.legal.ddragonPrefix}
              <a
                href="https://developer.riotgames.com/docs/lol#data-dragon"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
              >
                Data Dragon
              </a>
              {t.legal.ddragonMid}
              <a
                href={
                  locale === "ja"
                    ? "https://www.riotgames.com/ja/legal"
                    : "https://www.riotgames.com/en/legal"
                }
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
              >
                Legal Jibber Jabber
              </a>
              {t.legal.ddragonSuffix}
            </p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
