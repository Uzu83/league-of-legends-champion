import { CHAMPIONS } from "./champions";
import { GAME_QUESTIONS, STORY_QUESTIONS } from "./questions";
import {
  type Champion,
  type DiagnosisType,
  GAME_DIMS,
  type GameDim,
  STORY_DIMS,
  type StoryDim,
} from "./types";

export type LikertAnswer = 1 | 2 | 3 | 4 | 5;

const normalize = (a: LikertAnswer): number => (a - 3) / 2;
const toBipolar = (v: number): number => 2 * v - 1;

interface DimSpec<D extends string> {
  dims: readonly D[];
  questions: readonly { weights: Partial<Record<D, number>> }[];
  vec: (champ: Champion) => Record<D, number>;
}

const STORY_SPEC: DimSpec<StoryDim> = {
  dims: STORY_DIMS,
  questions: STORY_QUESTIONS,
  vec: (c) => c.storyVec,
};

const GAME_SPEC: DimSpec<GameDim> = {
  dims: GAME_DIMS,
  questions: GAME_QUESTIONS,
  vec: (c) => c.gameVec,
};

function buildUserVector<D extends string>(
  spec: DimSpec<D>,
  answers: LikertAnswer[],
): Record<D, number> {
  const vec = Object.fromEntries(spec.dims.map((d) => [d, 0])) as Record<D, number>;
  spec.questions.forEach((q, i) => {
    const a = answers[i] ?? 3;
    const factor = normalize(a as LikertAnswer);
    for (const [dim, w] of Object.entries(q.weights) as [D, number][]) {
      vec[dim] += factor * w;
    }
  });
  return vec;
}

function distance<D extends string>(
  spec: DimSpec<D>,
  user: Record<D, number>,
  champ: Record<D, number>,
): number {
  let sum = 0;
  for (const d of spec.dims) {
    const diff = user[d] - toBipolar(champ[d]);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export const userStoryVector = (answers: LikertAnswer[]): Record<StoryDim, number> =>
  buildUserVector(STORY_SPEC, answers);
export const userGameVector = (answers: LikertAnswer[]): Record<GameDim, number> =>
  buildUserVector(GAME_SPEC, answers);

export interface MatchResult {
  champion: Champion;
  distance: number;
}

function rankWith<D extends string>(spec: DimSpec<D>, answers: LikertAnswer[]): MatchResult[] {
  const userVec = buildUserVector(spec, answers);
  return CHAMPIONS.map((c) => ({
    champion: c,
    distance: distance(spec, userVec, spec.vec(c)),
  })).sort((a, b) => a.distance - b.distance);
}

export function rankChampions(type: DiagnosisType, answers: LikertAnswer[]): MatchResult[] {
  return type === "story" ? rankWith(STORY_SPEC, answers) : rankWith(GAME_SPEC, answers);
}

export function topMatches(type: DiagnosisType, answers: LikertAnswer[], n = 4): MatchResult[] {
  return rankChampions(type, answers).slice(0, n);
}

export function farthestMatch(type: DiagnosisType, answers: LikertAnswer[]): MatchResult {
  const ranked = rankChampions(type, answers);
  return ranked[ranked.length - 1]!;
}
