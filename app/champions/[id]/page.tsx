import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAMPION_BY_ID, CHAMPIONS, championPortrait } from "@/lib/champions";
import {
  archetypeLabel,
  championBlurb,
  championName,
  championTitle,
  dict,
  gameDimAxis,
  regionLabel,
  storyDimLabel,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { GAME_DIMS, type GameDim, type StoryDim } from "@/lib/types";

export function generateStaticParams() {
  return CHAMPIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const champion = CHAMPION_BY_ID[id];
  if (!champion) return {};
  const locale = await getLocale();
  const name = championName(locale, champion);
  const title = championTitle(locale, champion);
  const description = championBlurb(locale, champion);
  return {
    title: `${name} — ${title}`,
    description,
    alternates: {
      canonical: `/champions/${id}`,
      languages: {
        ja: `/champions/${id}`,
        en: `/champions/${id}`,
        "x-default": `/champions/${id}`,
      },
    },
    openGraph: {
      title: `${name} — ${title}`,
      description,
      images: [{ url: championPortrait(champion.ddragonId), width: 120, height: 120 }],
      type: "article",
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function ChampionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const champion = CHAMPION_BY_ID[id];
  if (!champion) notFound();
  const locale = await getLocale();
  const t = dict(locale).champions;

  const topStoryDims = (Object.entries(champion.storyVec) as [StoryDim, number][])
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: championName(locale, champion),
    alternateName: locale === "ja" ? champion.name : champion.nameJa,
    description: championBlurb(locale, champion),
    image: championPortrait(champion.ddragonId),
    jobTitle: championTitle(locale, champion),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-xs text-(--color-text-muted) hover:underline">
        {t.detail.back}
      </Link>

      <section className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-(--color-accent)/60 md:h-40 md:w-40">
          <Image
            src={championPortrait(champion.ddragonId)}
            alt={championName(locale, champion)}
            fill
            sizes="160px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <p className="text-sm text-(--color-text-muted)">{championTitle(locale, champion)}</p>
          <h1 className="text-3xl font-bold text-(--color-accent)">
            {championName(locale, champion)}
          </h1>
          <p className="text-xs text-(--color-text-muted)">
            {champion.name} / {regionLabel(locale, champion.region)}
          </p>
          <div className="flex flex-wrap justify-center gap-1 md:justify-start">
            {champion.roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/20 px-2 py-0.5 text-xs"
              >
                {r}
              </span>
            ))}
            {champion.archetypes.map((a) => (
              <span
                key={a}
                className="rounded-full bg-(--color-accent)/20 px-2 py-0.5 text-xs text-(--color-accent)"
              >
                {archetypeLabel(locale, a)}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed">{championBlurb(locale, champion)}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-(--color-rune)">{t.detail.stats}</h2>
        <ul className="space-y-3">
          {GAME_DIMS.map((dim: GameDim) => {
            const v = champion.gameVec[dim];
            const axis = gameDimAxis(locale, dim);
            const lowPct = (1 - v) * 100;
            const highPct = v * 100;
            return (
              <li key={dim} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={
                      v < 0.5 ? "font-semibold text-(--color-accent)" : "text-(--color-text-muted)"
                    }
                  >
                    {axis.low}
                  </span>
                  <span
                    className={
                      v > 0.5 ? "font-semibold text-(--color-accent)" : "text-(--color-text-muted)"
                    }
                  >
                    {axis.high}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute left-1/2 top-0 h-full bg-(--color-accent)"
                    style={{
                      width: `${Math.abs(v - 0.5) * 100}%`,
                      transform: v < 0.5 ? "translateX(-100%)" : undefined,
                    }}
                  />
                  <div className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                </div>
                <div className="flex justify-between text-[10px] text-(--color-text-muted)">
                  <span>{lowPct.toFixed(0)}</span>
                  <span>{highPct.toFixed(0)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--color-accent)">{t.detail.story}</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {topStoryDims.map(([dim, v]) => (
            <li key={dim} className="flex items-center justify-between gap-2">
              <span>{storyDimLabel(locale, dim)}</span>
              <span className="text-xs text-(--color-text-muted)">{(v * 100).toFixed(0)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
