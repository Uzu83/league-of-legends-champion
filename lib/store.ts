"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LikertAnswer } from "./scoring";
import type { DiagnosisType } from "./types";

interface QuizState {
  answers: Record<DiagnosisType, (LikertAnswer | null)[]>;
  setAnswer: (type: DiagnosisType, index: number, answer: LikertAnswer) => void;
  reset: (type: DiagnosisType) => void;
}

const empty = (): (LikertAnswer | null)[] => Array.from({ length: 10 }, () => null);

export const useQuiz = create<QuizState>()(
  persist(
    (set) => ({
      answers: { story: empty(), game: empty() },
      setAnswer: (type, index, answer) =>
        set((state) => {
          const next = state.answers[type].slice();
          next[index] = answer;
          return { answers: { ...state.answers, [type]: next } };
        }),
      reset: (type) => set((state) => ({ answers: { ...state.answers, [type]: empty() } })),
    }),
    {
      name: "lol-character-type-quiz",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? (undefined as unknown as Storage) : window.sessionStorage,
      ),
    },
  ),
);
