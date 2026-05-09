import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { championPortrait } from "@/lib/champions";
import { decodeAnswers } from "@/lib/encoding";
import {
  archetypeLabel,
  championBlurb,
  championName,
  championTitle,
  dict,
  gameDimAxis,
  regionLabel,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { describeGame, describeStory } from "@/lib/persona";
import {
  farthestMatch,
  topMatches,
  userGameVector,
  userStoryVector,
} from "@/lib/scoring";
import { GAME_DIMS, type GameDim } from "@/lib/types";

export const dynamicParams = true;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

interface PageParams {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { hash } = await params;
  const decoded = decodeAnswers(hash);
  const locale = await getLocale();
  if (!decoded) return { title: locale === "ja" ? "結果が見つかりません" : "Result not found" };
  const top3 = topMatches(decoded.type, decoded.answers, 3);
  const top = top3[0];
  if (!top) return { title: locale === "ja" ? "結果" : "Result" };
  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers), locale)
      : describeGame(userGameVector(decoded.answers), locale);
  const t = dict(locale).result;
  const typeLabel = t.typeLabel[decoded.type];
  const top3Names = top3.map((m) => championName(locale, m.champion)).join(" / ");
  const title =
    locale === "ja"
      ? `「${persona.label}」型 → ${championName(locale, top.champion)}`
      : `"${persona.label}" → ${championName(locale, top.champion)}`;
  const description =
    locale === "ja"
      ? `${typeLabel}入り口診断: ${persona.label}型。上位3候補: ${top3Names}`
      : `${typeLabel} entry quiz result: "${persona.label}". Top 3: ${top3Names}`;
  const ogImage = `/api/og?hash=${hash}&lang=${locale}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/result/${hash}`,
      languages: {
        ja: `/result/${hash}`,
        en: `/result/${hash}`,
        "x-default": `/result/${hash}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
      locale: locale === "ja" ? "ja_JP" : "en_US",
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
  const locale = await getLocale();
  const t = dict(locale);
  const matches = topMatches(decoded.type, decoded.answers, 5);
  const [best, ...rest] = matches;
  if (!best) notFound();
  const opposite = farthestMatch(decoded.type, decoded.answers);

  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers), locale)
      : describeGame(userGameVector(decoded.answers), locale);
  const userGameVec =
    decoded.type === "game" ? userGameVector(decoded.answers) : null;

  const typeLabel = t.result.typeLabel[decoded.type];
  const otherType = decoded.type === "story" ? "game" : "story";
  const otherTypeLabel = t.result.typeLabel[otherType];

  const top3Names = matches.slice(0, 3).map((m) => championName(locale, m.champion)).join(" / ");
  const shareText = t.result.shareText(persona.label, championName(locale, best.champion), top3Names);
  const shareUrl = `${SITE_URL}/result/${hash}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const headerLabel = decoded.type === "story" ? t.result.typeStory : t.result.typeGame;

  return (
    <div className="space-y-10">
      <section className="space-y-3 text-center">
        <p className="text-xs text-(--color-text-muted)">{headerLabel}</p>
        <h1 className="text-2xl font-bold md:text-3xl">
          {t.result.youAre}{" "}
          <span className="text-(--color-accent)">
            {locale === "ja" ? `「${persona.label}」` : `"${persona.label}"`}
          </span>
          {t.result.typeSuffix && ` ${t.result.typeSuffix}`}
        </h1>
        <div className="mx-auto max-w-xl space-y-2 rounded-xl bg-white/5 p-4 text-sm leading-relaxed">
          {persona.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-(--color-accent)/40 bg-(--color-card) p-6 md:p-8">
        <p className="mb-3 text-center text-xs text-(--color-text-muted) md:text-left">
          {t.result.bestMatch}
        </p>
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-(--color-accent)/60 md:h-40 md:w-40">
            <Image
              src={championPortrait(best.champion.ddragonId)}
              alt={championName(locale, best.champion)}
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <p className="text-sm text-(--color-text-muted)">{championTitle(locale, best.champion)}</p>
              <h2 className="text-3xl font-bold text-(--color-accent) md:text-4xl">
                {championName(locale, best.champion)}
              </h2>
              <p className="text-xs text-(--color-text-muted)">
                {best.champion.name} / {regionLabel(locale, best.champion.region)}
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
                  {archetypeLabel(locale, a)}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed">{championBlurb(locale, best.champion)}</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:justify-start">
              <a
                href={twitterHref}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-(--color-rune)/40 px-3 py-1 hover:border-(--color-rune)"
              >
                {t.result.tweetCta}
              </a>
              <Link
                href={`/champions/${best.champion.id}`}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
              >
                {t.result.championDetail}
              </Link>
              <Link
                href={`/q/${decoded.type}`}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
              >
                {t.result.retake}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {userGameVec && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-(--color-rune)">{t.result.profile8}</h3>
          <ul className="space-y-3 rounded-xl bg-white/5 p-4">
            {GAME_DIMS.map((dim: GameDim) => {
              const v = Math.max(-1, Math.min(1, userGameVec[dim]));
              const axis = gameDimAxis(locale, dim);
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
          {t.result.nextClose(rest.length)}
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
                  alt={championName(locale, m.champion)}
                  fill
                  sizes="48px"
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
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-red-500/30 bg-red-950/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-red-300">{t.result.oppositeHeading}</h3>
        <Link
          href={`/champions/${opposite.champion.id}`}
          className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/5"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-red-500/40">
            <Image
              src={championPortrait(opposite.champion.ddragonId)}
              alt={championName(locale, opposite.champion)}
              fill
              sizes="64px"
              className="object-cover grayscale"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold">{championName(locale, opposite.champion)}</p>
            <p className="text-xs text-(--color-text-muted)">
              {championTitle(locale, opposite.champion)} /{" "}
              {regionLabel(locale, opposite.champion.region)}
            </p>
            <p className="mt-1 text-xs text-red-300/80">
              {t.result.oppositeNote(opposite.distance.toFixed(2))}
            </p>
          </div>
        </Link>
      </section>

      <section className="rounded-xl border border-(--color-rune)/30 bg-(--color-rune)/5 p-5 text-center">
        <p className="text-xs text-(--color-text-muted)">{t.result.crossLead}</p>
        <p className="mt-1 text-sm">{t.result.crossBody}</p>
        <Link
          href={`/q/${otherType}`}
          className="mt-3 inline-block rounded-full bg-(--color-rune) px-5 py-2 text-sm font-semibold text-black"
        >
          {t.result.crossCta(otherTypeLabel)}
        </Link>
        <p className="mt-3 text-[11px] text-(--color-text-muted)">
          {t.result.bothDone}{" "}
          <Link href="/compare" className="text-(--color-rune) hover:underline">
            {t.result.compareLink}
          </Link>
        </p>
      </section>
    </div>
  );
}
