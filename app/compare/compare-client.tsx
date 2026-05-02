"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { championPortrait } from "@/lib/champions";
import { describeGame, describeStory } from "@/lib/persona";
import {
  type LikertAnswer,
  type MatchResult,
  topMatches,
  userGameVector,
  userStoryVector,
} from "@/lib/scoring";
import { useQuiz } from "@/lib/store";
import { REGION_LABEL_JA } from "@/lib/types";

interface SideResult {
  top: MatchResult[];
  label: string;
  paragraphs: string[];
}

function makeSide(answers: (LikertAnswer | null)[], type: "story" | "game"): SideResult | null {
  if (answers.some((a) => a == null)) return null;
  const filled = answers as LikertAnswer[];
  const persona =
    type === "story" ? describeStory(userStoryVector(filled)) : describeGame(userGameVector(filled));
  return {
    top: topMatches(type, filled, 3),
    label: persona.label,
    paragraphs: persona.paragraphs,
  };
}

export default function CompareClient() {
  const answers = useQuiz((s) => s.answers);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="py-16 text-center text-sm text-(--color-text-muted)">読み込み中…</div>
    );
  }

  const story = makeSide(answers.story, "story");
  const game = makeSide(answers.game, "game");

  if (!story && !game) {
    return (
      <div className="space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold">比較ビュー</h1>
        <p className="text-sm text-(--color-text-muted)">
          まだどちらも診断していません。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/q/story"
            className="rounded-full border border-(--color-accent)/40 px-4 py-2 text-sm hover:border-(--color-accent)"
          >
            🌍 ストーリーから始める
          </Link>
          <Link
            href="/q/game"
            className="rounded-full border border-(--color-rune)/40 px-4 py-2 text-sm hover:border-(--color-rune)"
          >
            ⚔️ ゲーム性能から始める
          </Link>
        </div>
      </div>
    );
  }

  if (!story || !game) {
    const missingType = !story ? "story" : "game";
    const missingLabel = !story ? "ストーリー" : "ゲーム性能";
    return (
      <div className="space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold">比較するにはあと一歩</h1>
        <p className="text-sm text-(--color-text-muted)">
          {missingLabel}入り口がまだです。両方診断すると並列比較が表示されます。
        </p>
        <Link
          href={`/q/${missingType}`}
          className="inline-block rounded-full bg-(--color-rune) px-5 py-2 text-sm font-semibold text-black"
        >
          {missingLabel}入り口を診断 →
        </Link>
      </div>
    );
  }

  const storyIds = new Set(story.top.map((m) => m.champion.id));
  const gameIds = new Set(game.top.map((m) => m.champion.id));
  const overlap = [...storyIds].filter((id) => gameIds.has(id));
  const overlapChamp =
    overlap.length > 0
      ? story.top.find((m) => m.champion.id === overlap[0])?.champion ?? null
      : null;

  return (
    <div className="space-y-10">
      <header className="space-y-2 text-center">
        <p className="text-xs text-(--color-text-muted)">クロス入り口比較</p>
        <h1 className="text-2xl font-bold md:text-3xl">
          ストーリー × ゲーム性能
        </h1>
      </header>

      {overlapChamp ? (
        <section className="rounded-2xl border border-(--color-accent) bg-(--color-accent)/10 p-6 text-center">
          <p className="text-sm text-(--color-accent)">🎯 完全一致</p>
          <h2 className="mt-2 text-3xl font-bold text-(--color-accent)">
            あなたは {overlapChamp.nameJa} の体現者
          </h2>
          <p className="mt-2 text-xs text-(--color-text-muted)">
            両エントリーの上位3に共通: {overlap.join(", ")}
          </p>
          <div className="mx-auto mt-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-(--color-accent)">
            <Image
              src={championPortrait(overlapChamp.ddragonId)}
              alt={overlapChamp.nameJa}
              width={96}
              height={96}
              className="object-cover"
              unoptimized
            />
          </div>
        </section>
      ) : (
        <section className="rounded-xl bg-white/5 p-4 text-center text-sm text-(--color-text-muted)">
          上位3に共通するチャンピオンはなし。性格とプレイ志向で別人格…！
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <SideCard
          title="🌍 ストーリー"
          accent="accent"
          label={story.label}
          paragraphs={story.paragraphs}
          top={story.top}
        />
        <SideCard
          title="⚔️ ゲーム性能"
          accent="rune"
          label={game.label}
          paragraphs={game.paragraphs}
          top={game.top}
        />
      </section>
    </div>
  );
}

function SideCard({
  title,
  accent,
  label,
  paragraphs,
  top,
}: {
  title: string;
  accent: "accent" | "rune";
  label: string;
  paragraphs: string[];
  top: MatchResult[];
}) {
  const colorVar = accent === "accent" ? "--color-accent" : "--color-rune";
  return (
    <div className={`rounded-2xl border border-(${colorVar})/30 bg-(--color-card) p-5`}>
      <p className="text-xs text-(--color-text-muted)">{title}</p>
      <h3 className={`mt-1 text-xl font-bold text-(${colorVar})`}>「{label}」型</h3>
      <div className="mt-2 space-y-1 text-xs leading-relaxed text-(--color-text-muted)">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {top.map((m, i) => (
          <li key={m.champion.id}>
            <Link
              href={`/champions/${m.champion.id}`}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
            >
              <span className="w-4 text-xs text-(--color-text-muted)">#{i + 1}</span>
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/20">
                <Image
                  src={championPortrait(m.champion.ddragonId)}
                  alt={m.champion.nameJa}
                  fill
                  sizes="40px"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
