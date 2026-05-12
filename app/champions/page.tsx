import type { Metadata } from "next";
import { CHAMPIONS, championPortrait } from "@/lib/champions";
import { championName, dict, hreflangAlternates, OG_LOCALE } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import ChampionsIndexClient from "./champions-client";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://league-of-legends-champion.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dict(locale).champions;
  return {
    title: t.heading,
    description: t.metaDescription,
    keywords: [
      "League of Legends champions",
      "LoL champion list",
      "champion roster",
      "LoL champions",
      "Riot Games champions",
      "LOLチャンピオン一覧",
      "LOLキャラ一覧",
    ],
    alternates: {
      canonical: "/champions",
      languages: hreflangAlternates("/champions"),
    },
    openGraph: {
      title: t.heading,
      description: t.metaDescription,
      type: "website",
      locale: OG_LOCALE[locale],
    },
  };
}

export default async function ChampionsIndex({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const locale = await getLocale();
  const { q: qParam } = await searchParams;
  const q = Array.isArray(qParam) ? qParam[0] : qParam;
  const t = dict(locale).champions;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: CHAMPIONS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: championName(locale, c),
      url: `${SITE_URL}/champions/${c.id}`,
      image: championPortrait(c.ddragonId),
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict(locale).metadata.title,
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.heading,
        item: `${SITE_URL}/champions`,
      },
    ],
  };
  return (
    <>
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
      <ChampionsIndexClient champions={CHAMPIONS} locale={locale} initialQuery={q ?? ""} />
    </>
  );
}
