import Link from "next/link";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://league-of-legends-champion.vercel.app";

export default async function Home() {
  const locale = await getLocale();
  const t = dict(locale).home;

  // Quiz JSON-LD: helps search engines understand what the page is for.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: dict(locale).metadata.title,
    description: dict(locale).metadata.description,
    url: SITE_URL,
    inLanguage: locale === "ja" ? "ja-JP" : "en-US",
    educationalLevel: "Beginner",
    about: { "@type": "VideoGame", name: "League of Legends" },
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is server-rendered safe content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {t.heading1}
          <br />
          {t.heading2}
        </h1>
        <p className="mx-auto max-w-xl text-sm text-(--color-text-muted) md:text-base">{t.lead}</p>
      </section>

      <section className="relative rounded-2xl border-2 border-(--color-accent) bg-gradient-to-br from-(--color-accent)/10 to-(--color-rune)/5 p-6 md:p-8">
        <span className="absolute -top-3 right-4 rounded-full bg-(--color-accent) px-3 py-0.5 text-xs font-semibold text-black">
          {t.pickedBadge}
        </span>
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-(--color-accent) md:text-2xl">{t.shikkari}</h2>
          <span className="text-xs text-(--color-text-muted)">{t.shikkariMeta}</span>
        </div>
        <p className="mb-5 text-sm leading-relaxed">{t.shikkariBody}</p>
        <p className="mb-3 text-xs text-(--color-text-muted)">{t.shikkariPick}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/q/story"
            className="group flex flex-col gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-card) p-5 transition-colors hover:border-(--color-accent)"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-semibold text-(--color-accent)">{t.storyTitle}</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">{t.storyDesc}</p>
            <span className="mt-auto text-xs text-(--color-accent) group-hover:underline">
              {t.startHere}
            </span>
          </Link>

          <Link
            href="/q/game"
            className="group flex flex-col gap-2 rounded-xl border border-(--color-rune)/40 bg-(--color-card) p-5 transition-colors hover:border-(--color-rune)"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <span className="font-semibold text-(--color-rune)">{t.gameTitle}</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">{t.gameDesc}</p>
            <span className="mt-auto text-xs text-(--color-rune) group-hover:underline">
              {t.startHere}
            </span>
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">{t.quick}</h3>
          <span className="text-[10px] text-(--color-text-muted)">{t.quickMeta}</span>
        </div>
        <p className="mb-3 text-xs text-(--color-text-muted)">{t.quickBody}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/q/story"
            className="rounded-full border border-(--color-accent)/30 px-3 py-1 hover:border-(--color-accent)"
          >
            {t.onlyStory}
          </Link>
          <Link
            href="/q/game"
            className="rounded-full border border-(--color-rune)/30 px-3 py-1 hover:border-(--color-rune)"
          >
            {t.onlyGame}
          </Link>
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-(--color-text-muted)">
        <Link href="/compare" className="hover:underline">
          {t.compareLink}
        </Link>
        <span aria-hidden>/</span>
        <Link href="/champions" className="hover:underline">
          {t.championsLink}
        </Link>
      </section>
    </div>
  );
}
