import type { LikertAnswer } from "./scoring";
import type { DiagnosisType } from "./types";

export interface DecodedAnswers {
  type: DiagnosisType;
  answers: LikertAnswer[];
}

const PREFIX: Record<DiagnosisType, string> = { story: "s", game: "g" };

export function encodeAnswers(type: DiagnosisType, answers: LikertAnswer[]): string {
  return `${PREFIX[type]}${answers.join("")}`;
}

export function decodeAnswers(hash: string): DecodedAnswers | null {
  if (hash.length < 2) return null;
  const head = hash[0];
  const body = hash.slice(1);
  const type: DiagnosisType | null = head === "s" ? "story" : head === "g" ? "game" : null;
  if (!type) return null;
  if (body.length !== 10) return null;
  const answers: LikertAnswer[] = [];
  for (const ch of body) {
    const n = Number(ch);
    if (!Number.isInteger(n) || n < 1 || n > 5) return null;
    answers.push(n as LikertAnswer);
  }
  return { type, answers };
}
