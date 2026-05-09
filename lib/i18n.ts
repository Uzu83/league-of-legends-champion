import type { Archetype, Champion, GameDim, Region, Role, StoryDim } from "./types";

export const LOCALES = ["ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Pick the best locale from an Accept-Language header. Returns DEFAULT_LOCALE on miss. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const primary = tag.split("-")[0];
    if (primary === "ja") return "ja";
    if (primary === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

/** Pick the locale based on cookie, then Accept-Language header. */
export function resolveLocale(opts: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(opts.cookie)) return opts.cookie;
  return localeFromAcceptLanguage(opts.acceptLanguage);
}

// ────────────────────────────────────────────────────────────────────────────
// Static label maps. JA values come from existing data; EN values are the
// canonical casing already used in code (Region/Role/Archetype enums) plus
// human-tuned translations for dim labels.

export const REGION_LABEL: Record<Locale, Record<Region, string>> = {
  ja: {
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
  },
  en: {
    Demacia: "Demacia",
    Noxus: "Noxus",
    Ionia: "Ionia",
    Piltover: "Piltover",
    Zaun: "Zaun",
    Bilgewater: "Bilgewater",
    Targon: "Targon",
    Shurima: "Shurima",
    Freljord: "Freljord",
    ShadowIsles: "Shadow Isles",
    Void: "The Void",
    Ixtal: "Ixtal",
    BandleCity: "Bandle City",
  },
};

export const ARCHETYPE_LABEL: Record<Locale, Record<Archetype, string>> = {
  ja: {
    Assassin: "アサシン",
    Mage: "メイジ",
    Marksman: "マークスマン",
    Tank: "タンク",
    Fighter: "ファイター",
    Bruiser: "ブルーザー",
    Support: "サポート",
    Specialist: "スペシャリスト",
  },
  en: {
    Assassin: "Assassin",
    Mage: "Mage",
    Marksman: "Marksman",
    Tank: "Tank",
    Fighter: "Fighter",
    Bruiser: "Bruiser",
    Support: "Support",
    Specialist: "Specialist",
  },
};

export const ROLE_LABEL: Record<Locale, Record<Role, string>> = {
  ja: { Top: "Top", Jungle: "Jungle", Mid: "Mid", ADC: "ADC", Support: "Support" },
  en: { Top: "Top", Jungle: "Jungle", Mid: "Mid", ADC: "Bot", Support: "Support" },
};

export const STORY_DIM_LABEL: Record<Locale, Record<StoryDim, string>> = {
  ja: {
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
  },
  en: {
    honor: "Honor",
    revenge: "Revenge",
    protection: "Protection",
    freedom: "Freedom",
    knowledge: "Knowledge",
    chaos: "Chaos",
    love: "Love",
    justice: "Justice",
    ambition: "Ambition",
    solitude: "Solitude",
    solo: "Solo",
    family: "Family",
    organization: "Order",
    mentor: "Mentorship",
    rival: "Rivalry",
  },
};

export const GAME_DIM_AXIS: Record<Locale, Record<GameDim, { low: string; high: string }>> = {
  ja: {
    range: { low: "近距離", high: "遠距離" },
    skillBased: { low: "AA中心", high: "スキル中心" },
    damageStyle: { low: "DPS型", high: "バースト型" },
    durability: { low: "脆い", high: "堅い" },
    damage: { low: "低火力", high: "高火力" },
    cc: { low: "CC弱", high: "CC強" },
    mobility: { low: "鈍重", high: "機敏" },
    difficulty: { low: "やさしい", high: "難しい" },
    scaling: { low: "序盤型", high: "終盤型" },
  },
  en: {
    range: { low: "Melee", high: "Ranged" },
    skillBased: { low: "Auto-attack", high: "Skill-based" },
    damageStyle: { low: "DPS", high: "Burst" },
    durability: { low: "Squishy", high: "Tanky" },
    damage: { low: "Utility", high: "High damage" },
    cc: { low: "Low CC", high: "High CC" },
    mobility: { low: "Slow", high: "Mobile" },
    difficulty: { low: "Easy", high: "Hard" },
    scaling: { low: "Early game", high: "Late game" },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// UI string dictionary. Keep keys descriptive and stable.

export const T = {
  ja: {
    siteName: "LOLキャラタイプ診断",
    unofficial: "非公式",
    version: "v0.1 MVP",
    home: {
      heading1: "あなたとLOLキャラを繋ぐ、",
      heading2: "世界観の入り口診断",
      lead: "性格 (ストーリー) と プレイ志向 (ゲーム性能) の2エントリー診断で、172体のチャンピオンから最もマッチする1体 + 上位5体を提示。",
      pickedBadge: "推し",
      shikkari: "🎯 しっかり診断",
      shikkariMeta: "20問・約6分",
      shikkariBody: "両方の入り口を診断 → 結果が一致したチャンピオンを強調表示。性格 × プレイ志向の精度が最大化されます。",
      shikkariPick: "どちらから始めますか？",
      quick: "⚡ クイック診断",
      quickMeta: "10問・約3分",
      quickBody: "片方だけサクッと試したい人向け",
      storyTitle: "ストーリー",
      storyDesc: "性格・価値観・関係性志向の10問",
      gameTitle: "ゲーム性能",
      gameDesc: "プレイスタイル・好きな役割の10問",
      startHere: "ここから始める →",
      onlyStory: "🌍 ストーリーだけ",
      onlyGame: "⚔️ ゲーム性能だけ",
      compareLink: "→ 両方診断済みなら比較ビュー",
      championsLink: "→ 全172チャンピオン一覧",
    },
    quiz: {
      storyTitle: "🌍 ストーリーから探す",
      gameTitle: "⚔️ ゲーム性能から探す",
      storyLead: "性格・価値観・関係性志向の10問。直感で答えてOK。",
      gameLead: "プレイスタイル・好きな役割の10問。直感で答えてOK。",
      progress: (i: number, n: number) => `Q${i} / ${n}`,
      prev: "← 前の質問",
      next: "次の質問 →",
      submit: "結果を見る",
      missing: "未回答の質問があります。前に戻って回答してください。",
    },
    likert: ["とてもそう思わない", "そう思わない", "どちらでもない", "そう思う", "とてもそう思う"],
    result: {
      typeStory: "ストーリー入り口 診断結果",
      typeGame: "ゲーム性能入り口 診断結果",
      youAre: "あなたは",
      typeSuffix: "型",
      bestMatch: "最もマッチするチャンピオン",
      tweetCta: "X (Twitter) でシェア",
      championDetail: "チャンピオン詳細",
      retake: "もう一度診断",
      profile8: "⚔️ あなたの8軸プロフィール",
      nextClose: (n: number) => `次に近いタイプ (${n}体)`,
      oppositeHeading: "⚠️ あなたの完全なる反対型",
      oppositeNote: (d: string) => `分かり合えないかもしれない (距離 ${d})`,
      crossLead: "しっかり診断 (20問) の続き",
      crossBody: "もう一方の入り口を診断すると、性格 × プレイ志向の比較ができます",
      crossCta: (other: string) => `${other}から探す →`,
      bothDone: "両方終わったら",
      compareLink: "比較ビュー",
      typeLabel: { story: "ストーリー", game: "ゲーム性能" } as Record<"story" | "game", string>,
      shareText: (label: string, name: string, top3: string) =>
        `「${label}」型→${name}にマッチ (上位3: ${top3}) #LOLキャラタイプ診断`,
    },
    compare: {
      heading: "ストーリー × ゲーム性能",
      caption: "クロス入り口比較",
      perfect: "🎯 完全一致",
      youAre: (name: string) => `あなたは ${name} の体現者`,
      overlapNote: (ids: string) => `両エントリーの上位3に共通: ${ids}`,
      noOverlap: "上位3に共通するチャンピオンはなし。性格とプレイ志向で別人格…！",
      bothMissing: "まだどちらも診断していません。",
      stillNeedHeading: "比較するにはあと一歩",
      stillNeedBody: (label: string) => `${label}入り口がまだです。両方診断すると並列比較が表示されます。`,
      goCta: (label: string) => `${label}入り口を診断 →`,
      loading: "読み込み中…",
    },
    champions: {
      heading: "全チャンピオン一覧",
      counter: (n: number, total: number) => `${n} / ${total} 体`,
      searchPlaceholder: "名前で検索 (例: ガレン, Yasuo)",
      filterRole: "ロール",
      filterRegion: "リージョン",
      filterArchetype: "アーキタイプ",
      all: "すべて",
      empty: "該当するチャンピオンはいません",
      detail: {
        back: "← ホームに戻る",
        stats: "⚔️ 性能8軸",
        story: "🌍 ストーリー特性",
      },
    },
    metadata: {
      title: "LOLキャラタイプ診断",
      description:
        "あなたの性格・プレイ志向に最も近いLeague of Legendsチャンピオンを診断します。世界観 / ゲーム性能の2つの入り口から選べます。",
      ogDescription:
        "あなたとLOLキャラを繋ぐ、世界観の入り口診断。10問×2エントリーで、性格とプレイ志向にぴったりのチャンピオンを提示。",
    },
    legal: {
      disclaimerSuffix:
        "はライアットゲームズが公式承認するものではなく、ライアットゲームズまたはリーグ・オブ・レジェンドの製作・管理に正式に関与した者の見解に基づくものではありません。",
      trademark:
        "リーグ・オブ・レジェンド及びライアットゲームズはRiot Games, Inc.の商標です。",
      ddragonPrefix: "チャンピオン画像は",
      ddragonMid: "より配信。本サイトは",
      ddragonSuffix: "に基づき制作されたファンプロジェクトです。",
    },
    locale: { ja: "日本語", en: "English" } as Record<Locale, string>,
  },
  en: {
    siteName: "LoL Character Type Quiz",
    unofficial: "Unofficial",
    version: "v0.1 MVP",
    home: {
      heading1: "Find the League of Legends",
      heading2: "champion that matches you",
      lead:
        "Two entries — story and gameplay — pick the closest champion out of 172 with vector matching. 10 questions per entry.",
      pickedBadge: "Pick",
      shikkari: "🎯 Full quiz",
      shikkariMeta: "20 questions · ~6 min",
      shikkariBody:
        "Take both entries — champions that overlap in the top 3 are highlighted. Maximises the personality × gameplay fit.",
      shikkariPick: "Where do you want to start?",
      quick: "⚡ Quick quiz",
      quickMeta: "10 questions · ~3 min",
      quickBody: "For when you only want to try one side.",
      storyTitle: "Story",
      storyDesc: "10 questions about values, personality, and relationships",
      gameTitle: "Gameplay",
      gameDesc: "10 questions about playstyle and preferred role",
      startHere: "Start here →",
      onlyStory: "🌍 Story only",
      onlyGame: "⚔️ Gameplay only",
      compareLink: "→ Compare view (after taking both)",
      championsLink: "→ All 172 champions",
    },
    quiz: {
      storyTitle: "🌍 Story entry",
      gameTitle: "⚔️ Gameplay entry",
      storyLead: "10 questions on values, personality, and relationships. Trust your gut.",
      gameLead: "10 questions on playstyle and preferred role. Trust your gut.",
      progress: (i: number, n: number) => `Q${i} / ${n}`,
      prev: "← Previous",
      next: "Next →",
      submit: "See result",
      missing: "Some questions are unanswered. Go back and finish them.",
    },
    likert: ["Strongly disagree", "Disagree", "Neither", "Agree", "Strongly agree"],
    result: {
      typeStory: "Story entry — your result",
      typeGame: "Gameplay entry — your result",
      youAre: "You are",
      typeSuffix: "",
      bestMatch: "Closest champion match",
      tweetCta: "Share on X",
      championDetail: "Champion details",
      retake: "Retake",
      profile8: "⚔️ Your 8-axis profile",
      nextClose: (n: number) => `Next closest (${n})`,
      oppositeHeading: "⚠️ Your complete opposite",
      oppositeNote: (d: string) => `You may not see eye to eye (distance ${d})`,
      crossLead: "Continue the full quiz (20 questions)",
      crossBody:
        "Take the other entry too — you'll see your personality vs. your playstyle side by side.",
      crossCta: (other: string) => `Try the ${other} entry →`,
      bothDone: "Already done both?",
      compareLink: "Compare view",
      typeLabel: { story: "story", game: "gameplay" } as Record<"story" | "game", string>,
      shareText: (label: string, name: string, top3: string) =>
        `I'm a "${label}" → matched ${name} (top 3: ${top3}) #LoLCharacterType`,
    },
    compare: {
      heading: "Story × Gameplay",
      caption: "Cross-entry comparison",
      perfect: "🎯 Perfect match",
      youAre: (name: string) => `You embody ${name}`,
      overlapNote: (ids: string) => `Champions in both top 3: ${ids}`,
      noOverlap: "No champion appears in both top 3 — split personality between story and gameplay!",
      bothMissing: "You haven't taken either quiz yet.",
      stillNeedHeading: "One more step before comparing",
      stillNeedBody: (label: string) =>
        `The ${label} entry is missing. Take both to see the side-by-side comparison.`,
      goCta: (label: string) => `Take the ${label} entry →`,
      loading: "Loading…",
    },
    champions: {
      heading: "All champions",
      counter: (n: number, total: number) => `${n} / ${total}`,
      searchPlaceholder: "Search by name (e.g. Garen, ヤスオ)",
      filterRole: "Role",
      filterRegion: "Region",
      filterArchetype: "Archetype",
      all: "All",
      empty: "No champions match.",
      detail: {
        back: "← Back to home",
        stats: "⚔️ 8 gameplay axes",
        story: "🌍 Story traits",
      },
    },
    metadata: {
      title: "LoL Character Type Quiz",
      description:
        "Find the League of Legends champion closest to your personality and playstyle. Two entry points: story (worldview) and gameplay (role/archetype).",
      ogDescription:
        "Find your League of Legends character type. 10 questions × 2 entries, vector-matched against 172 champions.",
    },
    legal: {
      disclaimerSuffix:
        " isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.",
      trademark: "League of Legends and Riot Games are trademarks of Riot Games, Inc.",
      ddragonPrefix: "Champion portraits served by ",
      ddragonMid: ". This site is a fan project compliant with ",
      ddragonSuffix: ".",
    },
    locale: { ja: "日本語", en: "English" } as Record<Locale, string>,
  },
} as const;

export type Dict = (typeof T)[Locale];
export const dict = (locale: Locale): Dict => T[locale];

// Convenience accessors for places that don't want to plumb the dict.
export const regionLabel = (locale: Locale, r: Region) => REGION_LABEL[locale][r];
export const archetypeLabel = (locale: Locale, a: Archetype) => ARCHETYPE_LABEL[locale][a];
export const roleLabel = (locale: Locale, r: Role) => ROLE_LABEL[locale][r];
export const storyDimLabel = (locale: Locale, d: StoryDim) => STORY_DIM_LABEL[locale][d];
export const gameDimAxis = (locale: Locale, d: GameDim) => GAME_DIM_AXIS[locale][d];

export const championName = (locale: Locale, c: Champion) =>
  locale === "ja" ? c.nameJa : c.name;
export const championTitle = (locale: Locale, c: Champion) =>
  locale === "ja" ? c.titleJa : c.title;

/**
 * Localized champion blurb. JA uses the hand-curated DDragon text; EN
 * synthesizes a short tagline from title + region + archetypes because we
 * deliberately don't ship 172 hand-translated EN blurbs.
 */
export function championBlurb(locale: Locale, c: Champion): string {
  if (locale === "ja") return c.blurb;
  const archetypeBit = c.archetypes.map((a) => ARCHETYPE_LABEL.en[a]).join(" / ");
  const region = REGION_LABEL.en[c.region];
  const roles = c.roles.map((r) => ROLE_LABEL.en[r]).join(" / ");
  // c.title is the actual DDragon EN epithet, e.g. "the Darkin Blade".
  return `${c.name}, ${c.title}. From ${region}, plays as ${archetypeBit || "—"}${
    roles ? ` (${roles})` : ""
  }.`;
}
