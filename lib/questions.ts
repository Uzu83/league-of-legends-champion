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
    text: "自分が悪役になれば済む話なら、迷わずなる",
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
    text: "好敵手がいると、刃が鋭くなる",
    weights: { rival: 0.8, ambition: 0.3 },
  },
];

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: "g1",
    text: "最初から強くありたい",
    weights: { scaling: -0.7, damage: 0.3, durability: 0.2 },
  },
  {
    id: "g2",
    text: "正面より奇襲。横からゲームを引っかき回す",
    weights: { mobility: 0.7, difficulty: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g3",
    text: "戦略こそ全て",
    weights: { skillBased: 0.6, cc: 0.4, difficulty: 0.4, damage: 0.2 },
  },
  {
    id: "g4",
    text: "射程ギリギリで間合いを取り、一方的に削り続けたい",
    weights: { range: 0.9, damageStyle: -0.6, damage: 0.4 },
  },
  {
    id: "g5",
    text: "強い味方を育て、勝利はみんなで掴みたい",
    weights: { cc: 0.5, damage: -0.4, range: 0.4, skillBased: 0.5 },
  },
  {
    id: "g6",
    text: "重要人物を一瞬で葬り去ることこそ至高",
    weights: { damageStyle: 0.9, damage: 0.7, mobility: 0.5 },
  },
  {
    id: "g7",
    text: "開戦の狼煙を上げるのは自分だ",
    weights: { durability: 0.7, cc: 0.7, damage: -0.3, range: -0.4, scaling: -0.2 },
  },
  {
    id: "g8",
    text: "複雑な操作にこそ燃える",
    weights: { difficulty: 0.9, skillBased: 0.5 },
  },
  {
    id: "g9",
    text: "踏み込んでは引く、その駆け引きが楽しい",
    weights: { mobility: 0.8, range: 0.3, damageStyle: 0.2 },
  },
  {
    id: "g10",
    text: "一発の起点で戦況をひっくり返したい",
    weights: { cc: 0.8, damageStyle: 0.4, durability: 0.3, range: 0.3 },
  },
];
