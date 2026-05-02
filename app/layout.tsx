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
              className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold tracking-wide text-(--color-accent)"
            >
              LOL キャラタイプ診断
              <span className="rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] font-normal text-(--color-text-muted)">
                非公式
              </span>
            </Link>
            <nav className="text-xs text-(--color-text-muted)">
              <span>v0.1 MVP</span>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{children}</main>
        <footer className="border-t border-white/10 py-6 text-xs text-(--color-text-muted)">
          <div className="mx-auto max-w-3xl space-y-2 px-4 text-center leading-relaxed">
            <p>
              <strong className="text-(--color-text)">LOLキャラタイプ診断</strong>
              はライアットゲームズが公式承認するものではなく、ライアットゲームズまたはリーグ・オブ・レジェンドの製作・管理に正式に関与した者の見解に基づくものではありません。
            </p>
            <p>
              リーグ・オブ・レジェンド及びライアットゲームズはRiot Games, Inc.の商標です。
            </p>
            <p className="text-[10px] opacity-60">
              チャンピオン画像は{" "}
              <a
                href="https://developer.riotgames.com/docs/lol#data-dragon"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
              >
                Data Dragon
              </a>
              {" "}より配信。本サイトは
              <a
                href="https://www.riotgames.com/ja/legal"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
              >
                Legal Jibber Jabber
              </a>
              に基づき制作されたファンプロジェクトです。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
