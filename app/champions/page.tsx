import type { Metadata } from "next";
import { CHAMPIONS } from "@/lib/champions";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import ChampionsIndexClient from "./champions-client";

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
  return <ChampionsIndexClient champions={CHAMPIONS} locale={locale} />;
}
