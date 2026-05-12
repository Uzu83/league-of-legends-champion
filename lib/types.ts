import type { Locale } from "./i18n";

export const REGIONS = [
  "Demacia",
  "Noxus",
  "Ionia",
  "Piltover",
  "Zaun",
  "Bilgewater",
  "Targon",
  "Shurima",
  "Freljord",
  "ShadowIsles",
  "Void",
  "Ixtal",
  "BandleCity",
] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_LABEL_JA: Record<Region, string> = {
  Demacia: "デマーシア",
  Noxus: "ノクサス",
  Ionia: "アイオニア",
  Piltover: "ピルトーヴァー",
  Zaun: "ゾウン",
  Bilgewater: "ビルジウォーター",
  Targon: "ターゴン",
  Shurima: "シュリーマ",
  Freljord: "フレヨルド",
  ShadowIsles: "シャドウアイル",
  Void: "ヴォイド",
  Ixtal: "イシュタル",
  BandleCity: "バンドルシティ",
};

export const STORY_DIMS = [
  "honor",
  "revenge",
  "protection",
  "freedom",
  "knowledge",
  "chaos",
  "love",
  "justice",
  "ambition",
  "solitude",
  "solo",
  "family",
  "organization",
  "mentor",
  "rival",
] as const;
export type StoryDim = (typeof STORY_DIMS)[number];
export const STORY_DIM_LABEL_JA: Record<StoryDim, string> = {
  honor: "名誉",
  revenge: "復讐",
  protection: "守護",
  freedom: "自由",
  knowledge: "知識",
  chaos: "混沌",
  love: "愛",
  justice: "正義",
  ambition: "野心",
  solitude: "孤独",
  solo: "単独行動",
  family: "家族重視",
  organization: "組織所属",
  mentor: "師弟関係",
  rival: "ライバル関係",
};

export const GAME_DIMS = [
  "range",
  "skillBased",
  "damageStyle",
  "durability",
  "damage",
  "cc",
  "mobility",
  "difficulty",
  "scaling",
] as const;
export type GameDim = (typeof GAME_DIMS)[number];

export const GAME_DIM_AXIS_JA: Record<GameDim, { low: string; high: string }> = {
  range: { low: "近距離", high: "遠距離" },
  skillBased: { low: "AA中心", high: "スキル中心" },
  damageStyle: { low: "DPS型", high: "バースト型" },
  durability: { low: "脆い", high: "堅い" },
  damage: { low: "低火力", high: "高火力" },
  cc: { low: "CC弱", high: "CC強" },
  mobility: { low: "鈍重", high: "機敏" },
  difficulty: { low: "やさしい", high: "難しい" },
  scaling: { low: "序盤型", high: "終盤型" },
};

export const ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;
export type Role = (typeof ROLES)[number];

export const ARCHETYPES = [
  "Assassin",
  "Mage",
  "Marksman",
  "Tank",
  "Fighter",
  "Bruiser",
  "Support",
  "Specialist",
] as const;
export type Archetype = (typeof ARCHETYPES)[number];

export const ARCHETYPE_LABEL_JA: Record<Archetype, string> = {
  Assassin: "アサシン",
  Mage: "メイジ",
  Marksman: "マークスマン",
  Tank: "タンク",
  Fighter: "ファイター",
  Bruiser: "ブルーザー",
  Support: "サポート",
  Specialist: "スペシャリスト",
};

export type DiagnosisType = "story" | "game";

/** Per-locale champion strings (name / title / blurb) keyed by locale. */
export type ChampionLoc = Partial<
  Record<Locale, { name?: string; title?: string; blurb?: string }>
>;

export interface Champion {
  id: string;
  /** English (DDragon en_US). Canonical fallback for every non-ja locale. */
  name: string;
  /** Japanese (DDragon ja_JP). */
  nameJa: string;
  /** English epithet (DDragon en_US). */
  title: string;
  /** Japanese epithet (DDragon ja_JP). */
  titleJa: string;
  region: Region;
  ddragonId: string;
  roles: Role[];
  archetypes: Archetype[];
  storyVec: Record<StoryDim, number>;
  gameVec: Record<GameDim, number>;
  /** Hand-curated JA blurb from DDragon ja_JP. */
  blurb: string;
  /** DDragon en_US blurb. Optional — falls back to a synthesized tagline when absent. */
  blurbEn?: string;
  /**
   * Localized name / title / blurb for the non-ja, non-en locales (and `en`
   * blurb). Populated by `scripts/fetch-champions.mjs` from DDragon. Optional —
   * accessors fall back to `name` / `title` / a synthesized blurb.
   */
  loc?: ChampionLoc;
}
