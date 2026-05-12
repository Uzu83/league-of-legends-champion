import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton, Track } from "@/lib/analytics";
import { CHAMPION_BY_ID, CHAMPIONS, championPortrait } from "@/lib/champions";
import {
  archetypeLabel,
  championBlurb,
  championName,
  championTitle,
  dict,
  gameDimAxis,
  hreflangAlternates,
  OG_LOCALE,
  regionLabel,
  storyDimLabel,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { similarChampions } from "@/lib/scoring";
import { GAME_DIMS, type GameDim, type StoryDim } from "@/lib/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://league-of-legends-champion.vercel.app";

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
      languages: hreflangAlternates(`/champions/${id}`),
    },
    openGraph: {
      title: `${name} — ${title}`,
      description,
      images: [{ url: `/api/og?champion=${id}&lang=${locale}`, width: 1200, height: 630 }],
      type: "article",
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${title}`,
      description,
      images: [`/api/og?champion=${id}&lang=${locale}`],
    },
  };
}

export default async function ChampionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const champion = CHAMPION_BY_ID[id];
  if (!champion) notFound();
  const locale = await getLocale();
  const t = dict(locale).champions;

  const topStoryDims = (Object.entries(champion.storyVec) as [StoryDim, number][])
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const similar = similarChampions(champion, 6);
  const sameRegion = CHAMPIONS.filter(
    (c) => c.region === champion.region && c.id !== champion.id,
  ).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: championName(locale, champion),
    alternateName: locale === "ja" ? champion.name : champion.nameJa,
    description: championBlurb(locale, champion),
    image: championPortrait(champion.ddragonId),
    jobTitle: championTitle(locale, champion),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict(locale).metadata.title, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: t.heading, item: `${SITE_URL}/champions` },
      {
        "@type": "ListItem",
        position: 3,
        name: championName(locale, champion),
        item: `${SITE_URL}/champions/${id}`,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Track event="champion_view" data={{ id }} />
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
              <span key={r} className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
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
          <div className="flex justify-center md:justify-start">
            <ShareButton
              text={t.detail.shareText(championName(locale, champion))}
              url={`${SITE_URL}/champions/${id}`}
              label={t.detail.shareCta}
              event="champion_share"
              data={{ id }}
              className="rounded-full border border-(--color-rune)/40 px-3 py-1 text-xs hover:border-(--color-rune)"
            />
          </div>
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

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--color-rune)">{t.detail.similar}</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((c) => (
            <li key={c.id}>
              <Link
                href={`/champions/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:border-white/30"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                  <Image
                    src={championPortrait(c.ddragonId)}
                    alt={championName(locale, c)}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{championName(locale, c)}</p>
                  <p className="truncate text-xs text-(--color-text-muted)">
                    {regionLabel(locale, c.region)} / {c.roles.join(", ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {sameRegion.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-(--color-rune)">
            {t.detail.sameRegion(regionLabel(locale, champion.region))}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sameRegion.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/champions/${c.id}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:border-white/30"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                    <Image
                      src={championPortrait(c.ddragonId)}
                      alt={championName(locale, c)}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{championName(locale, c)}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">
                      {regionLabel(locale, c.region)} / {c.roles.join(", ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
