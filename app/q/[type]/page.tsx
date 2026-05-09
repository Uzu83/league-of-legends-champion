import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import type { DiagnosisType } from "@/lib/types";
import QuizClient from "./quiz-client";

const VALID: DiagnosisType[] = ["story", "game"];

export function generateStaticParams() {
  return VALID.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  if (!VALID.includes(type as DiagnosisType)) return {};
  const locale = await getLocale();
  const t = dict(locale).quiz;
  const title = type === "story" ? t.storyTitle : t.gameTitle;
  const lead = type === "story" ? t.storyLead : t.gameLead;
  return {
    title,
    description: lead,
    alternates: {
      canonical: `/q/${type}`,
      languages: { ja: `/q/${type}`, en: `/q/${type}`, "x-default": `/q/${type}` },
    },
  };
}

export default async function QuizPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!VALID.includes(type as DiagnosisType)) notFound();
  const locale = await getLocale();
  return <QuizClient type={type as DiagnosisType} locale={locale} />;
}
