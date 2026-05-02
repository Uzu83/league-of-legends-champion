import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LOLキャラタイプ診断",
    template: "%s | LOLキャラタイプ診断",
  },
  description:
    "あなたの性格・プレイ志向に最も近いLeague of Legendsチャンピオンを診断します。世界観 / ゲーム性能の2つの入り口から選べます。",
  keywords: [
    "LOL",
    "League of Legends",
    "診断",
    "キャラタイプ",
    "性格診断",
    "MBTI",
    "チャンピオン",
  ],
  openGraph: {
    title: "LOLキャラタイプ診断",
    description:
      "あなたとLOLキャラを繋ぐ、世界観の入り口診断。10問×2エントリーで、性格とプレイ志向にぴったりのチャンピオンを提示。",
    type: "website",
    locale: "ja_JP",
    siteName: "LOLキャラタイプ診断",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="font-[var(--font-display)] text-lg font-semibold tracking-wide text-(--color-accent)"
            >
              LOL キャラタイプ診断
            </Link>
            <nav className="text-xs text-(--color-text-muted)">
              <span>v0.1 MVP</span>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{children}</main>
        <footer className="border-t border-white/10 py-6 text-center text-xs text-(--color-text-muted)">
          League of Legendsはライアットゲームズの登録商標です。本サイトは非公式ファンメイドです。
        </footer>
      </body>
    </html>
  );
}
