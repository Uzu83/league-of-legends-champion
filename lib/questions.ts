import type { GameDim, StoryDim } from "./types";

export interface StoryQuestion {
  id: string;
  text: string;
  weights: Partial<Record<StoryDim, number>>;
}

export interface GameQuestion {
  id: string;
  text: string;
  weights: Partial<Record<GameDim, number>>;
}

export const LIKERT_LABELS = [
  "とてもそう思わない",
  "そう思わない",
  "どちらでもない",
  "そう思う",
  "とてもそう思う",
] as const;

export const STORY_QUESTIONS: StoryQuestion[] = [
  {
    id: "s1",
    text: "間違っていても、ブレない奴の方が好きだ",
    weights: { honor: 0.7, organization: 0.6, justice: 0.3 },
  },
  {
    id: "s2",
    text: "やられたら倍にして返す",
    weights: { revenge: 0.9, rival: 0.5 },
  },
  {
    id: "s3",
    text: "大切な人を守るためなら、嫌われ役になる覚悟がある",
    weights: { protection: 0.8, love: 0.6, family: 0.6 },
  },
  {
    id: "s4",
    text: "安寧より革命",
    weights: { chaos: 0.8, freedom: 0.6, ambition: 0.4 },
  },
  {
    id: "s5",
    text: "立入禁止の扉ほど、開けたくなる",
    weights: { knowledge: 0.8, chaos: 0.3 },
  },
  {
    id: "s6",
    text: "光より闇。バッドエンドの物語の方が美しい",
    weights: { chaos: 0.5, solitude: 0.6 },
  },
  {
    id: "s7",
    text: "自分が頂点に立てば、世界の方が動く",
    weights: { ambition: 0.8, solo: 0.6 },
  },
  {
    id: "s8",
    text: "群れるより、独りで歩きたい",
    weights: { solitude: 0.8, solo: 0.7, organization: -0.4 },
  },
  {
    id: "s9",
    text: "迷った時、頭に浮かぶ顔が一つある",
    weights: { mentor: 0.9 },
  },
  {
    id: "s10",
    text: "ライバルがいると、自分も伸びる気がする",
    weights: { rival: 0.8, ambition: 0.3 },
  },
];

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: "g1",
    text: "じわじわ強くなるより、最初から派手に活躍したい",
    weights: { scaling: -0.7, damage: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g2",
    text: "正面突破より、予想外の動きで相手を出し抜きたい",
    weights: { mobility: 0.7, difficulty: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g3",
    text: "最後にすべてをひっくり返す方が好きだ",
    weights: { scaling: 0.8, damage: 0.3, durability: 0.2 },
  },
  {
    id: "g4",
    text: "遠くから少しずつダメージを与えて、相手を追い詰めたい",
    weights: { range: 0.9, damageStyle: -0.6, damage: 0.4 },
  },
  {
    id: "g5",
    text: "自分は表に出ず、味方を支えて勝ちたい",
    weights: { cc: 0.5, damage: -0.4, range: 0.4, skillBased: 0.5 },
  },
  {
    id: "g6",
    text: "敵のエース格を一瞬で倒す爽快感が欲しい",
    weights: { damageStyle: 0.9, damage: 0.7, mobility: 0.5 },
  },
  {
    id: "g7",
    text: "真っ先に飛び込んで、戦いを始めるのは自分だ",
    weights: { durability: 0.7, cc: 0.7, damage: -0.3, range: -0.4, scaling: -0.2 },
  },
  {
    id: "g8",
    text: "複雑な操作にこそ燃える",
    weights: { difficulty: 0.9, skillBased: 0.5 },
  },
  {
    id: "g9",
    text: "攻めて引いてを繰り返すヒット&アウェイが好き",
    weights: { mobility: 0.8, range: 0.3, damageStyle: 0.2 },
  },
  {
    id: "g10",
    text: "決定的な一手で、戦況を一気にひっくり返したい",
    weights: { cc: 0.8, damageStyle: 0.4, durability: 0.3, range: 0.3, scaling: 0.2 },
  },
];
