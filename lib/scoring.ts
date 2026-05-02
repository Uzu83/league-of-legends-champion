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

export function userStoryVector(answers: LikertAnswer[]): Record<StoryDim, number> {
  const vec = Object.fromEntries(STORY_DIMS.map((d) => [d, 0])) as Record<StoryDim, number>;
  STORY_QUESTIONS.forEach((q, i) => {
    const a = answers[i] ?? 3;
    const factor = normalize(a as LikertAnswer);
    for (const [dim, w] of Object.entries(q.weights) as [StoryDim, number][]) {
      vec[dim] += factor * w;
    }
  });
  return vec;
}

export function userGameVector(answers: LikertAnswer[]): Record<GameDim, number> {
  const vec = Object.fromEntries(GAME_DIMS.map((d) => [d, 0])) as Record<GameDim, number>;
  GAME_QUESTIONS.forEach((q, i) => {
    const a = answers[i] ?? 3;
    const factor = normalize(a as LikertAnswer);
    for (const [dim, w] of Object.entries(q.weights) as [GameDim, number][]) {
      vec[dim] += factor * w;
    }
  });
  return vec;
}

const toBipolar = (v: number): number => 2 * v - 1;

function distanceStory(user: Record<StoryDim, number>, champ: Record<StoryDim, number>): number {
  let sum = 0;
  for (const d of STORY_DIMS) {
    const diff = user[d] - toBipolar(champ[d]);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function distanceGame(user: Record<GameDim, number>, champ: Record<GameDim, number>): number {
  let sum = 0;
  for (const d of GAME_DIMS) {
    const diff = user[d] - toBipolar(champ[d]);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export interface MatchResult {
  champion: Champion;
  distance: number;
}

export function rankChampions(type: DiagnosisType, answers: LikertAnswer[]): MatchResult[] {
  if (type === "story") {
    const userVec = userStoryVector(answers);
    return CHAMPIONS.map((c) => ({
      champion: c,
      distance: distanceStory(userVec, c.storyVec),
    })).sort((a, b) => a.distance - b.distance);
  }
  const userVec = userGameVector(answers);
  return CHAMPIONS.map((c) => ({ champion: c, distance: distanceGame(userVec, c.gameVec) })).sort(
    (a, b) => a.distance - b.distance,
  );
}

export function topMatches(type: DiagnosisType, answers: LikertAnswer[], n = 4): MatchResult[] {
  return rankChampions(type, answers).slice(0, n);
}

export function farthestMatch(type: DiagnosisType, answers: LikertAnswer[]): MatchResult {
  const ranked = rankChampions(type, answers);
  return ranked[ranked.length - 1]!;
}
