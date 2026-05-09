import type { Metadata } from "next";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import CompareClient from "./compare-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dict(locale);
  return {
    title: t.compare.heading,
    description: t.compare.caption,
    alternates: {
      canonical: "/compare",
      languages: { ja: "/compare", en: "/compare", "x-default": "/compare" },
    },
  };
}

export default async function ComparePage() {
  const locale = await getLocale();
  return <CompareClient locale={locale} />;
}
