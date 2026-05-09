import type { Metadata } from "next";
import { CHAMPIONS, championPortrait } from "@/lib/champions";
import { championName, dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import ChampionsIndexClient from "./champions-client";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dict(locale).champions;
  return {
    title: t.heading,
    description: t.heading,
    alternates: {
      canonical: "/champions",
      languages: { ja: "/champions", en: "/champions", "x-default": "/champions" },
    },
  };
}

export default async function ChampionsIndex() {
  const locale = await getLocale();
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
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChampionsIndexClient champions={CHAMPIONS} locale={locale} />
    </>
  );
}
