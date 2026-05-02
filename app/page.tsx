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
          10問×2エントリーで、性格とプレイ志向にぴったりのチャンピオンを提示。
          診断結果からそのチャンピオンの世界観・ゲーム上の役割に踏み込めます。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/q/story"
          className="group flex flex-col gap-3 rounded-xl border border-(--color-accent)/30 bg-(--color-card) p-6 transition-colors hover:border-(--color-accent)"
        >
          <span className="text-3xl">🌍</span>
          <h2 className="text-xl font-semibold text-(--color-accent)">ストーリーから探す</h2>
          <p className="text-sm text-(--color-text-muted)">
            性格・価値観・関係性志向の10問。リージョン・動機・関係性軸でマッチング。
          </p>
          <span className="mt-auto text-sm text-(--color-accent) group-hover:underline">
            診断を始める →
          </span>
        </Link>

        <Link
          href="/q/game"
          className="group flex flex-col gap-3 rounded-xl border border-(--color-rune)/30 bg-(--color-card) p-6 transition-colors hover:border-(--color-rune)"
        >
          <span className="text-3xl">⚔️</span>
          <h2 className="text-xl font-semibold text-(--color-rune)">ゲーム性能から探す</h2>
          <p className="text-sm text-(--color-text-muted)">
            プレイスタイル・好きな役割の10問。ロール・アーキタイプ・スキル特性でマッチング。
          </p>
          <span className="mt-auto text-sm text-(--color-rune) group-hover:underline">
            診断を始める →
          </span>
        </Link>
      </section>

      <section className="rounded-xl bg-white/5 p-4 text-xs text-(--color-text-muted)">
        どちらから始めても、診断後にもう一方の入り口を試して比較できます。
        所要時間は片方あたり約3分。
        <Link
          href="/compare"
          className="ml-2 text-(--color-rune) hover:underline"
        >
          → 両方診断済の人は比較ビューへ
        </Link>
      </section>
    </div>
  );
}
