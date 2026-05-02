import { notFound } from "next/navigation";
import type { DiagnosisType } from "@/lib/types";
import QuizClient from "./quiz-client";

const VALID: DiagnosisType[] = ["story", "game"];

export function generateStaticParams() {
  return VALID.map((type) => ({ type }));
}

export default async function QuizPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!VALID.includes(type as DiagnosisType)) notFound();
  return <QuizClient type={type as DiagnosisType} />;
}
