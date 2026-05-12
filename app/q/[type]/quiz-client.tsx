"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { encodeAnswers } from "@/lib/encoding";
import { dict, type Locale } from "@/lib/i18n";
import { GAME_QUESTIONS, STORY_QUESTIONS } from "@/lib/questions";
import type { LikertAnswer } from "@/lib/scoring";
import { useQuiz } from "@/lib/store";
import type { DiagnosisType } from "@/lib/types";

export default function QuizClient({ type, locale }: { type: DiagnosisType; locale: Locale }) {
  const router = useRouter();
  const t = dict(locale);
  const questions = type === "story" ? STORY_QUESTIONS : GAME_QUESTIONS;
  const stored = useQuiz((s) => s.answers[type]);
  const setAnswer = useQuiz((s) => s.setAnswer);

  const [index, setIndex] = useState<number>(() => {
    const firstUnanswered = stored.findIndex((a) => a == null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });

  const currentQ = questions[index]!;
  const current = stored[index] ?? null;

  const isComplete = useMemo(() => stored.every((a) => a != null), [stored]);

  const handleSelect = (a: LikertAnswer) => {
    setAnswer(type, index, a);
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleSubmit = () => {
    if (!stored.every((a) => a != null)) return;
    const answers = stored as LikertAnswer[];
    const hash = encodeAnswers(type, answers);
    router.push(`/result/${hash}`);
  };

  const progress = ((index + 1) / questions.length) * 100;
  const title = type === "story" ? t.quiz.storyTitle : t.quiz.gameTitle;
  const lead = type === "story" ? t.quiz.storyLead : t.quiz.gameLead;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-(--color-accent)">{title}</h1>
        <p className="text-sm text-(--color-text-muted)">{lead}</p>
      </header>

      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-(--color-accent) transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-(--color-text-muted)">
        {t.quiz.progress(index + 1, questions.length)}
      </div>

      <article className="rounded-xl bg-(--color-card) p-5 md:p-6">
        <p className="text-base leading-relaxed md:text-lg">{currentQ.text[locale]}</p>
      </article>

      <div className="grid gap-2">
        {t.likert.map((label, i) => {
          const value = (i + 1) as LikertAnswer;
          const active = current === value;
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleSelect(value)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent)"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs disabled:opacity-30"
        >
          {t.quiz.prev}
        </button>
        {index < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex(Math.min(questions.length - 1, index + 1))}
            className="rounded-lg border border-white/20 px-3 py-2 text-xs"
          >
            {t.quiz.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete}
            className="rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.quiz.submit}
          </button>
        )}
      </div>

      {!isComplete && index === questions.length - 1 && (
        <p className="text-center text-xs text-(--color-text-muted)">{t.quiz.missing}</p>
      )}
    </div>
  );
}
