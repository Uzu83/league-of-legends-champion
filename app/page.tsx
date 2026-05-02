import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          あなたとLOLキャラを繋ぐ、
          <br />
          世界観の入り口診断
        </h1>
        <p className="mx-auto max-w-xl text-sm text-(--color-text-muted) md:text-base">
          性格 (ストーリー) と プレイ志向 (ゲーム性能) の2エントリー診断で、
          172体のチャンピオンから最もマッチする1体 + 上位5体を提示。
        </p>
      </section>

      {/* Primary: 完全診断 */}
      <section className="relative rounded-2xl border-2 border-(--color-accent) bg-gradient-to-br from-(--color-accent)/10 to-(--color-rune)/5 p-6 md:p-8">
        <span className="absolute -top-3 right-4 rounded-full bg-(--color-accent) px-3 py-0.5 text-xs font-semibold text-black">
          推し
        </span>
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-(--color-accent) md:text-2xl">
            🎯 しっかり診断
          </h2>
          <span className="text-xs text-(--color-text-muted)">20問・約6分</span>
        </div>
        <p className="mb-5 text-sm leading-relaxed">
          両方の入り口を診断 → 結果が一致したチャンピオンを強調表示。
          性格 × プレイ志向の精度が最大化されます。
        </p>
        <p className="mb-3 text-xs text-(--color-text-muted)">どちらから始めますか？</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/q/story"
            className="group flex flex-col gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-card) p-5 transition-colors hover:border-(--color-accent)"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-semibold text-(--color-accent)">ストーリー</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">
              性格・価値観・関係性志向の10問
            </p>
            <span className="mt-auto text-xs text-(--color-accent) group-hover:underline">
              ここから始める →
            </span>
          </Link>

          <Link
            href="/q/game"
            className="group flex flex-col gap-2 rounded-xl border border-(--color-rune)/40 bg-(--color-card) p-5 transition-colors hover:border-(--color-rune)"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <span className="font-semibold text-(--color-rune)">ゲーム性能</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">
              プレイスタイル・好きな役割の10問
            </p>
            <span className="mt-auto text-xs text-(--color-rune) group-hover:underline">
              ここから始める →
            </span>
          </Link>
        </div>
      </section>

      {/* Secondary: クイック診断 */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">⚡ クイック診断</h3>
          <span className="text-[10px] text-(--color-text-muted)">10問・約3分</span>
        </div>
        <p className="mb-3 text-xs text-(--color-text-muted)">
          片方だけサクッと試したい人向け
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/q/story"
            className="rounded-full border border-(--color-accent)/30 px-3 py-1 hover:border-(--color-accent)"
          >
            🌍 ストーリーだけ
          </Link>
          <Link
            href="/q/game"
            className="rounded-full border border-(--color-rune)/30 px-3 py-1 hover:border-(--color-rune)"
          >
            ⚔️ ゲーム性能だけ
          </Link>
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-(--color-text-muted)">
        <Link href="/compare" className="hover:underline">
          → 両方診断済みなら比較ビュー
        </Link>
        <span aria-hidden>/</span>
        <Link href="/champions" className="hover:underline">
          → 全172チャンピオン一覧
        </Link>
      </section>
    </div>
  );
}
