"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { championPortrait } from "@/lib/champions";
import { championName, dict, type Locale, regionLabel } from "@/lib/i18n";
import { describeGame, describeStory } from "@/lib/persona";
import {
  type LikertAnswer,
  type MatchResult,
  topMatches,
  userGameVector,
  userStoryVector,
} from "@/lib/scoring";
import { useQuiz } from "@/lib/store";

interface SideResult {
  top: MatchResult[];
  label: string;
  paragraphs: string[];
}

function makeSide(
  answers: (LikertAnswer | null)[],
  type: "story" | "game",
  locale: Locale,
): SideResult | null {
  if (answers.some((a) => a == null)) return null;
  const filled = answers as LikertAnswer[];
  const persona =
    type === "story"
      ? describeStory(userStoryVector(filled), locale)
      : describeGame(userGameVector(filled), locale);
  return {
    top: topMatches(type, filled, 3),
    label: persona.label,
    paragraphs: persona.paragraphs,
  };
}

export default function CompareClient({ locale }: { locale: Locale }) {
  const t = dict(locale);
  const answers = useQuiz((s) => s.answers);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="py-16 text-center text-sm text-(--color-text-muted)">
        {t.compare.loading}
      </div>
    );
  }

  const story = makeSide(answers.story, "story", locale);
  const game = makeSide(answers.game, "game", locale);

  if (!story && !game) {
    return (
      <div className="space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold">{t.compare.heading}</h1>
        <p className="text-sm text-(--color-text-muted)">{t.compare.bothMissing}</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/q/story"
            className="rounded-full border border-(--color-accent)/40 px-4 py-2 text-sm hover:border-(--color-accent)"
          >
            🌍 {t.home.storyTitle}
          </Link>
          <Link
            href="/q/game"
            className="rounded-full border border-(--color-rune)/40 px-4 py-2 text-sm hover:border-(--color-rune)"
          >
            ⚔️ {t.home.gameTitle}
          </Link>
        </div>
      </div>
    );
  }

  if (!story || !game) {
    const missingType = !story ? "story" : "game";
    const missingLabel = t.result.typeLabel[missingType];
    return (
      <div className="space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold">{t.compare.stillNeedHeading}</h1>
        <p className="text-sm text-(--color-text-muted)">{t.compare.stillNeedBody(missingLabel)}</p>
        <Link
          href={`/q/${missingType}`}
          className="inline-block rounded-full bg-(--color-rune) px-5 py-2 text-sm font-semibold text-black"
        >
          {t.compare.goCta(missingLabel)}
        </Link>
      </div>
    );
  }

  const storyIds = new Set(story.top.map((m) => m.champion.id));
  const gameIds = new Set(game.top.map((m) => m.champion.id));
  const overlap = [...storyIds].filter((id) => gameIds.has(id));
  const overlapChamp =
    overlap.length > 0
      ? (story.top.find((m) => m.champion.id === overlap[0])?.champion ?? null)
      : null;

  return (
    <div className="space-y-10">
      <header className="space-y-2 text-center">
        <p className="text-xs text-(--color-text-muted)">{t.compare.caption}</p>
        <h1 className="text-2xl font-bold md:text-3xl">{t.compare.heading}</h1>
      </header>

      {overlapChamp ? (
        <section className="rounded-2xl border border-(--color-accent) bg-(--color-accent)/10 p-6 text-center">
          <p className="text-sm text-(--color-accent)">{t.compare.perfect}</p>
          <h2 className="mt-2 text-3xl font-bold text-(--color-accent)">
            {t.compare.youAre(championName(locale, overlapChamp))}
          </h2>
          <p className="mt-2 text-xs text-(--color-text-muted)">
            {t.compare.overlapNote(overlap.join(", "))}
          </p>
          <div className="mx-auto mt-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-(--color-accent)">
            <Image
              src={championPortrait(overlapChamp.ddragonId)}
              alt={championName(locale, overlapChamp)}
              width={96}
              height={96}
              className="object-cover"
              unoptimized
            />
          </div>
        </section>
      ) : (
        <section className="rounded-xl bg-white/5 p-4 text-center text-sm text-(--color-text-muted)">
          {t.compare.noOverlap}
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <SideCard
          title={`🌍 ${t.home.storyTitle}`}
          accent="accent"
          label={story.label}
          paragraphs={story.paragraphs}
          top={story.top}
          locale={locale}
        />
        <SideCard
          title={`⚔️ ${t.home.gameTitle}`}
          accent="rune"
          label={game.label}
          paragraphs={game.paragraphs}
          top={game.top}
          locale={locale}
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
  locale,
}: {
  title: string;
  accent: "accent" | "rune";
  label: string;
  paragraphs: string[];
  top: MatchResult[];
  locale: Locale;
}) {
  const colorVar = accent === "accent" ? "--color-accent" : "--color-rune";
  const personaText = locale === "ja" ? `「${label}」型` : `"${label}"`;
  return (
    <div className={`rounded-2xl border border-(${colorVar})/30 bg-(--color-card) p-5`}>
      <p className="text-xs text-(--color-text-muted)">{title}</p>
      <h3 className={`mt-1 text-xl font-bold text-(${colorVar})`}>{personaText}</h3>
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
                  alt={championName(locale, m.champion)}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{championName(locale, m.champion)}</p>
                <p className="truncate text-xs text-(--color-text-muted)">
                  {regionLabel(locale, m.champion.region)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
