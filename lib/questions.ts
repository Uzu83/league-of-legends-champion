import type { Locale } from "./i18n";
import type { GameDim, StoryDim } from "./types";

export interface StoryQuestion {
  id: string;
  text: Record<Locale, string>;
  weights: Partial<Record<StoryDim, number>>;
}

export interface GameQuestion {
  id: string;
  text: Record<Locale, string>;
  weights: Partial<Record<GameDim, number>>;
}

export const STORY_QUESTIONS: StoryQuestion[] = [
  {
    id: "s1",
    text: {
      ja: "間違っていても、ブレない奴の方が好きだ",
      en: "I respect people who hold the line, even when they're wrong.",
    },
    weights: { honor: 0.7, organization: 0.6, justice: 0.3 },
  },
  {
    id: "s2",
    text: {
      ja: "やられたら倍にして返す",
      en: "Hit me once and I hit back twice.",
    },
    weights: { revenge: 0.9, rival: 0.5 },
  },
  {
    id: "s3",
    text: {
      ja: "大切な人を守るためなら、嫌われ役になる覚悟がある",
      en: "I'll play the bad guy if it keeps the people I love safe.",
    },
    weights: { protection: 0.8, love: 0.6, family: 0.6 },
  },
  {
    id: "s4",
    text: {
      ja: "安寧より革命",
      en: "I'd rather have revolution than peace.",
    },
    weights: { chaos: 0.8, freedom: 0.6, ambition: 0.4 },
  },
  {
    id: "s5",
    text: {
      ja: "立入禁止の扉ほど、開けたくなる",
      en: "The more forbidden the door, the more I want to open it.",
    },
    weights: { knowledge: 0.8, chaos: 0.3 },
  },
  {
    id: "s6",
    text: {
      ja: "光より闇。バッドエンドの物語の方が美しい",
      en: "Darkness over light — bad endings move me more than happy ones.",
    },
    weights: { chaos: 0.5, solitude: 0.6 },
  },
  {
    id: "s7",
    text: {
      ja: "自分が頂点に立てば、世界の方が動く",
      en: "If I rise to the top, the world will follow.",
    },
    weights: { ambition: 0.8, solo: 0.6 },
  },
  {
    id: "s8",
    text: {
      ja: "群れるより、独りで歩きたい",
      en: "I'd rather walk alone than run with the pack.",
    },
    weights: { solitude: 0.8, solo: 0.7, organization: -0.4 },
  },
  {
    id: "s9",
    text: {
      ja: "迷った時、頭に浮かぶ顔が一つある",
      en: "When I'm lost, one mentor's face always comes to mind.",
    },
    weights: { mentor: 0.9 },
  },
  {
    id: "s10",
    text: {
      ja: "ライバルがいると、自分も伸びる気がする",
      en: "Having a rival makes me sharper.",
    },
    weights: { rival: 0.8, ambition: 0.3 },
  },
];

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: "g1",
    text: {
      ja: "じわじわ強くなるより、最初から派手に活躍したい",
      en: "I'd rather pop off early than scale up slowly.",
    },
    weights: { scaling: -0.7, damage: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g2",
    text: {
      ja: "正面突破より、予想外の動きで相手を出し抜きたい",
      en: "I'd rather outplay than overpower.",
    },
    weights: { mobility: 0.7, difficulty: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g3",
    text: {
      ja: "最後にすべてをひっくり返す方が好きだ",
      en: "I love flipping the whole game in the late stages.",
    },
    weights: { scaling: 0.8, damage: 0.3, durability: 0.2 },
  },
  {
    id: "g4",
    text: {
      ja: "遠くから少しずつダメージを与えて、相手を追い詰めたい",
      en: "I prefer chipping enemies down from range until they break.",
    },
    weights: { range: 0.9, damageStyle: -0.6, damage: 0.4 },
  },
  {
    id: "g5",
    text: {
      ja: "自分は表に出ず、味方を支えて勝ちたい",
      en: "I'd rather enable my team than be the carry.",
    },
    weights: { cc: 0.5, damage: -0.4, range: 0.4, skillBased: 0.5 },
  },
  {
    id: "g6",
    text: {
      ja: "敵のエース格を一瞬で倒す爽快感が欲しい",
      en: "Deleting the enemy carry in one combo is the dream.",
    },
    weights: { damageStyle: 0.9, damage: 0.7, mobility: 0.5 },
  },
  {
    id: "g7",
    text: {
      ja: "真っ先に飛び込んで、戦いを始めるのは自分だ",
      en: "I'm the one who dives in first and starts the fight.",
    },
    weights: { durability: 0.7, cc: 0.7, damage: -0.3, range: -0.4, scaling: -0.2 },
  },
  {
    id: "g8",
    text: {
      ja: "複雑な操作にこそ燃える",
      en: "The more mechanically demanding, the better.",
    },
    weights: { difficulty: 0.9, skillBased: 0.5 },
  },
  {
    id: "g9",
    text: {
      ja: "攻めて引いてを繰り返すヒット&アウェイが好き",
      en: "I love the rhythm of poking in and dancing back out.",
    },
    weights: { mobility: 0.8, range: 0.3, damageStyle: 0.2 },
  },
  {
    id: "g10",
    text: {
      ja: "自分の決定的な一手で、戦況を一気にひっくり返したい",
      en: "I want one signature play to swing the whole teamfight.",
    },
    weights: { cc: 0.8, damageStyle: 0.4, durability: 0.3, range: 0.3, scaling: 0.2 },
  },
];

// Legacy export retained for callers that don't yet take a locale.
export const LIKERT_LABELS = [
  "とてもそう思わない",
  "そう思わない",
  "どちらでもない",
  "そう思う",
  "とてもそう思う",
] as const;
