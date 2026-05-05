import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { championPortrait } from "@/lib/champions";
import { decodeAnswers } from "@/lib/encoding";
import { describeGame, describeStory } from "@/lib/persona";
import {
  farthestMatch,
  topMatches,
  userGameVector,
  userStoryVector,
} from "@/lib/scoring";
import {
  ARCHETYPE_LABEL_JA,
  GAME_DIM_AXIS_JA,
  GAME_DIMS,
  type GameDim,
  REGION_LABEL_JA,
} from "@/lib/types";

export const dynamicParams = true;

interface PageParams {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { hash } = await params;
  const decoded = decodeAnswers(hash);
  if (!decoded) return { title: "結果が見つかりません" };
  const top3 = topMatches(decoded.type, decoded.answers, 3);
  const top = top3[0];
  if (!top) return { title: "結果" };
  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers))
      : describeGame(userGameVector(decoded.answers));
  const typeLabel = decoded.type === "story" ? "ストーリー" : "ゲーム性能";
  const top3Names = top3.map((m) => m.champion.nameJa).join(" / ");
  const title = `「${persona.label}」型 → ${top.champion.nameJa}`;
  const description = `${typeLabel}入り口診断: ${persona.label}型。上位3候補: ${top3Names}`;
  const ogImage = `/api/og?hash=${hash}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ResultPage({ params }: PageParams) {
  const { hash } = await params;
  const decoded = decodeAnswers(hash);
  if (!decoded) notFound();
  const matches = topMatches(decoded.type, decoded.answers, 5);
  const [best, ...rest] = matches;
  if (!best) notFound();
  const opposite = farthestMatch(decoded.type, decoded.answers);

  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers))
      : describeGame(userGameVector(decoded.answers));
  const userGameVec =
    decoded.type === "game" ? userGameVector(decoded.answers) : null;

  const typeLabel = decoded.type === "story" ? "ストーリー" : "ゲーム性能";
  const otherType = decoded.type === "story" ? "game" : "story";
  const otherTypeLabel = otherType === "story" ? "ストーリー" : "ゲーム性能";

  const top3Names = matches
    .slice(0, 3)
    .map((m) => m.champion.nameJa)
    .join(" / ");
  const shareText = `「${persona.label}」型→${best.champion.nameJa}にマッチ (上位3: ${top3Names}) #LOLキャラタイプ診断`;
  const shareUrl = `https://example.com/result/${hash}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="space-y-10">
      <section className="space-y-3 text-center">
        <p className="text-xs text-(--color-text-muted)">{typeLabel}入り口 診断結果</p>
        <h1 className="text-2xl font-bold md:text-3xl">
          あなたは <span className="text-(--color-accent)">「{persona.label}」</span> 型
        </h1>
        <div className="mx-auto max-w-xl space-y-2 rounded-xl bg-white/5 p-4 text-sm leading-relaxed">
          {persona.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-(--color-accent)/40 bg-(--color-card) p-6 md:p-8">
        <p className="mb-3 text-center text-xs text-(--color-text-muted) md:text-left">
          最もマッチするチャンピオン
        </p>
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-(--color-accent)/60 md:h-40 md:w-40">
            <Image
              src={championPortrait(best.champion.ddragonId)}
              alt={best.champion.nameJa}
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <p className="text-sm text-(--color-text-muted)">{best.champion.titleJa}</p>
              <h2 className="text-3xl font-bold text-(--color-accent) md:text-4xl">
                {best.champion.nameJa}
              </h2>
              <p className="text-xs text-(--color-text-muted)">
                {best.champion.name} / {REGION_LABEL_JA[best.champion.region]}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-1 md:justify-start">
              {best.champion.roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-white/20 px-2 py-0.5 text-xs"
                >
                  {r}
                </span>
              ))}
              {best.champion.archetypes.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-(--color-accent)/20 px-2 py-0.5 text-xs text-(--color-accent)"
                >
                  {ARCHETYPE_LABEL_JA[a]}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed">{best.champion.blurb}</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:justify-start">
              <a
                href={twitterHref}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-(--color-rune)/40 px-3 py-1 hover:border-(--color-rune)"
              >
                X (Twitter) でシェア
              </a>
              <Link
                href={`/champions/${best.champion.id}`}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
              >
                チャンピオン詳細
              </Link>
              <Link
                href={`/q/${decoded.type}`}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
              >
                もう一度診断
              </Link>
            </div>
          </div>
        </div>
      </section>

      {userGameVec && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-(--color-rune)">
            ⚔️ あなたの8軸プロフィール
          </h3>
          <ul className="space-y-3 rounded-xl bg-white/5 p-4">
            {GAME_DIMS.map((dim: GameDim) => {
              const v = Math.max(-1, Math.min(1, userGameVec[dim]));
              const axis = GAME_DIM_AXIS_JA[dim];
              const isLeft = v < 0;
              return (
                <li key={dim} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        isLeft ? "font-semibold text-(--color-rune)" : "text-(--color-text-muted)"
                      }
                    >
                      {axis.low}
                    </span>
                    <span
                      className={
                        !isLeft ? "font-semibold text-(--color-rune)" : "text-(--color-text-muted)"
                      }
                    >
                      {axis.high}
                    </span>
                  </div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="absolute top-0 h-full bg-(--color-rune)"
                      style={{
                        left: isLeft ? `${50 - Math.abs(v) * 50}%` : "50%",
                        width: `${Math.abs(v) * 50}%`,
                      }}
                    />
                    <div className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-(--color-text-muted)">
          次に近いタイプ ({rest.length}体)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((m) => (
            <Link
              key={m.champion.id}
              href={`/champions/${m.champion.id}`}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/30"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                <Image
                  src={championPortrait(m.champion.ddragonId)}
                  alt={m.champion.nameJa}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{m.champion.nameJa}</p>
                <p className="truncate text-xs text-(--color-text-muted)">
                  {REGION_LABEL_JA[m.champion.region]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-red-500/30 bg-red-950/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-red-300">
          ⚠️ あなたの完全なる反対型
        </h3>
        <Link
          href={`/champions/${opposite.champion.id}`}
          className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/5"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-red-500/40">
            <Image
              src={championPortrait(opposite.champion.ddragonId)}
              alt={opposite.champion.nameJa}
              fill
              sizes="64px"
              className="object-cover grayscale"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold">{opposite.champion.nameJa}</p>
            <p className="text-xs text-(--color-text-muted)">
              {opposite.champion.titleJa} / {REGION_LABEL_JA[opposite.champion.region]}
            </p>
            <p className="mt-1 text-xs text-red-300/80">
              分かり合えないかもしれない (距離 {opposite.distance.toFixed(2)})
            </p>
          </div>
        </Link>
      </section>

      <section className="rounded-xl border border-(--color-rune)/30 bg-(--color-rune)/5 p-5 text-center">
        <p className="text-xs text-(--color-text-muted)">しっかり診断 (20問) の続き</p>
        <p className="mt-1 text-sm">
          もう一方の入り口を診断すると、性格 × プレイ志向の比較ができます
        </p>
        <Link
          href={`/q/${otherType}`}
          className="mt-3 inline-block rounded-full bg-(--color-rune) px-5 py-2 text-sm font-semibold text-black"
        >
          {otherTypeLabel}から探す →
        </Link>
        <p className="mt-3 text-[11px] text-(--color-text-muted)">
          両方終わったら{" "}
          <Link href="/compare" className="text-(--color-rune) hover:underline">
            比較ビュー
          </Link>
        </p>
      </section>
    </div>
  );
}
