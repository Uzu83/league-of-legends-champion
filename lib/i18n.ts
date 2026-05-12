import type { Archetype, Champion, GameDim, Region, Role, StoryDim } from "./types";

// ────────────────────────────────────────────────────────────────────────────
// Locales. Internal codes are short; BCP47 / OG_LOCALE map them to the forms
// the platform wants (`<html lang>`, `og:locale`, hreflang).

export const LOCALES = ["ja", "en", "ko", "zh", "es", "fr", "de", "pt", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** BCP-47 tags for `<html lang>` and hreflang. */
export const BCP47: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  ko: "ko",
  zh: "zh-CN",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt-BR",
  ru: "ru",
};

/** `og:locale` values (Facebook-style locale codes). */
export const OG_LOCALE: Record<Locale, string> = {
  ja: "ja_JP",
  en: "en_US",
  ko: "ko_KR",
  zh: "zh_CN",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  ru: "ru_RU",
};

export const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Pick the best locale from an Accept-Language header. Returns DEFAULT_LOCALE on miss. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
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

/**
 * Best-effort locale for client components that can't read server headers
 * (e.g. `app/error.tsx`): the NEXT_LOCALE cookie, else `navigator.language`.
 */
export function clientLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];
  if (isLocale(cookie)) return cookie;
  return localeFromAcceptLanguage(typeof navigator !== "undefined" ? navigator.language : null);
}

/**
 * hreflang `alternates.languages` map for a given path. Same path for every
 * locale (the active locale is resolved per-request via cookie + Accept-Language),
 * plus `x-default` → English.
 */
export function hreflangAlternates(path: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of LOCALES) langs[BCP47[l]] = path;
  langs["x-default"] = path;
  return langs;
}

/**
 * Build a per-locale text record. Locales not given in `rest` mirror `en`
 * (a placeholder that renders fine until the real translation is supplied).
 * Used by `lib/questions.ts` and `lib/persona.ts` so their entries stay compact.
 */
export function localizedText(
  ja: string,
  en: string,
  rest: Partial<Record<Locale, string>> = {},
): Record<Locale, string> {
  return { ja, en, ko: en, zh: en, es: en, fr: en, de: en, pt: en, ru: en, ...rest };
}

// ────────────────────────────────────────────────────────────────────────────
// Static label maps. ja / en are hand-written; the other 7 locales currently
// mirror `en` and are filled in by the translation pass. (See TODO markers.)

const REGION_JA: Record<Region, string> = {
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
const REGION_EN: Record<Region, string> = {
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
};
const REGION_KO: Record<Region, string> = {
  Demacia: "데마시아",
  Noxus: "녹서스",
  Ionia: "아이오니아",
  Piltover: "필트오버",
  Zaun: "자운",
  Bilgewater: "빌지워터",
  Targon: "타곤",
  Shurima: "슈리마",
  Freljord: "프렐요드",
  ShadowIsles: "그림자 군도",
  Void: "공허",
  Ixtal: "익스탈",
  BandleCity: "밴들 시티",
};
const REGION_ZH: Record<Region, string> = {
  Demacia: "德玛西亚",
  Noxus: "诺克萨斯",
  Ionia: "艾欧尼亚",
  Piltover: "皮尔特沃夫",
  Zaun: "祖安",
  Bilgewater: "比尔吉沃特",
  Targon: "巨神峰",
  Shurima: "恕瑞玛",
  Freljord: "弗雷尔卓德",
  ShadowIsles: "暗影岛",
  Void: "虚空",
  Ixtal: "伊克塔尔",
  BandleCity: "班德尔城",
};
const REGION_ES: Record<Region, string> = {
  Demacia: "Demacia",
  Noxus: "Noxus",
  Ionia: "Jonia",
  Piltover: "Piltover",
  Zaun: "Zaun",
  Bilgewater: "Aguasturbias",
  Targon: "Tárgon",
  Shurima: "Shurima",
  Freljord: "Aguasgélidas",
  ShadowIsles: "Islas de las Sombras",
  Void: "el Vacío",
  Ixtal: "Ixtal",
  BandleCity: "Bandle",
};
const REGION_FR: Record<Region, string> = {
  Demacia: "Demacia",
  Noxus: "Noxus",
  Ionia: "Ionia",
  Piltover: "Piltover",
  Zaun: "Zaun",
  Bilgewater: "Bilgewater",
  Targon: "Targon",
  Shurima: "Shurima",
  Freljord: "Freljord",
  ShadowIsles: "Îles Obscures",
  Void: "le Néant",
  Ixtal: "Ixtal",
  BandleCity: "Bandle",
};
const REGION_DE: Record<Region, string> = {
  Demacia: "Demacia",
  Noxus: "Noxus",
  Ionia: "Ionia",
  Piltover: "Piltover",
  Zaun: "Zhaun",
  Bilgewater: "Bilgewasser",
  Targon: "Targon",
  Shurima: "Shurima",
  Freljord: "Freljord",
  ShadowIsles: "Schatteninseln",
  Void: "die Leere",
  Ixtal: "Ixtal",
  BandleCity: "Bandle-Stadt",
};
const REGION_PT: Record<Region, string> = {
  Demacia: "Demacia",
  Noxus: "Noxus",
  Ionia: "Ionia",
  Piltover: "Piltover",
  Zaun: "Zaun",
  Bilgewater: "Bilgewater",
  Targon: "Targon",
  Shurima: "Shurima",
  Freljord: "Freljord",
  ShadowIsles: "Ilhas das Sombras",
  Void: "o Vazio",
  Ixtal: "Ixtal",
  BandleCity: "Bandópolis",
};
const REGION_RU: Record<Region, string> = {
  Demacia: "Демасия",
  Noxus: "Ноксус",
  Ionia: "Иония",
  Piltover: "Пилтовер",
  Zaun: "Заун",
  Bilgewater: "Бильджвотер",
  Targon: "Таргон",
  Shurima: "Шурима",
  Freljord: "Фрельйорд",
  ShadowIsles: "Сумрачные острова",
  Void: "Бездна",
  Ixtal: "Иктал",
  BandleCity: "Бандл",
};
export const REGION_LABEL: Record<Locale, Record<Region, string>> = {
  ja: REGION_JA,
  en: REGION_EN,
  ko: REGION_KO,
  zh: REGION_ZH,
  es: REGION_ES,
  fr: REGION_FR,
  de: REGION_DE,
  pt: REGION_PT,
  ru: REGION_RU,
};

const ARCHETYPE_JA: Record<Archetype, string> = {
  Assassin: "アサシン",
  Mage: "メイジ",
  Marksman: "マークスマン",
  Tank: "タンク",
  Fighter: "ファイター",
  Bruiser: "ブルーザー",
  Support: "サポート",
  Specialist: "スペシャリスト",
};
const ARCHETYPE_EN: Record<Archetype, string> = {
  Assassin: "Assassin",
  Mage: "Mage",
  Marksman: "Marksman",
  Tank: "Tank",
  Fighter: "Fighter",
  Bruiser: "Bruiser",
  Support: "Support",
  Specialist: "Specialist",
};
const ARCHETYPE_KO: Record<Archetype, string> = {
  Assassin: "암살자",
  Mage: "마법사",
  Marksman: "원거리 딜러",
  Tank: "탱커",
  Fighter: "전사",
  Bruiser: "브루저",
  Support: "서포터",
  Specialist: "스페셜리스트",
};
const ARCHETYPE_ZH: Record<Archetype, string> = {
  Assassin: "刺客",
  Mage: "法师",
  Marksman: "射手",
  Tank: "坦克",
  Fighter: "战士",
  Bruiser: "斗士",
  Support: "辅助",
  Specialist: "特种兵",
};
const ARCHETYPE_ES: Record<Archetype, string> = {
  Assassin: "Asesino",
  Mage: "Mago",
  Marksman: "Tirador",
  Tank: "Tanque",
  Fighter: "Luchador",
  Bruiser: "Bruiser",
  Support: "Soporte",
  Specialist: "Especialista",
};
const ARCHETYPE_FR: Record<Archetype, string> = {
  Assassin: "Assassin",
  Mage: "Mage",
  Marksman: "Tireur",
  Tank: "Tank",
  Fighter: "Combattant",
  Bruiser: "Bruiser",
  Support: "Support",
  Specialist: "Spécialiste",
};
const ARCHETYPE_DE: Record<Archetype, string> = {
  Assassin: "Assassine",
  Mage: "Magier",
  Marksman: "Schütze",
  Tank: "Tank",
  Fighter: "Kämpfer",
  Bruiser: "Bruiser",
  Support: "Unterstützer",
  Specialist: "Spezialist",
};
const ARCHETYPE_PT: Record<Archetype, string> = {
  Assassin: "Assassino",
  Mage: "Mago",
  Marksman: "Atirador",
  Tank: "Tanque",
  Fighter: "Lutador",
  Bruiser: "Bruiser",
  Support: "Suporte",
  Specialist: "Especialista",
};
const ARCHETYPE_RU: Record<Archetype, string> = {
  Assassin: "Убийца",
  Mage: "Маг",
  Marksman: "Стрелок",
  Tank: "Танк",
  Fighter: "Боец",
  Bruiser: "Брузер",
  Support: "Поддержка",
  Specialist: "Специалист",
};
export const ARCHETYPE_LABEL: Record<Locale, Record<Archetype, string>> = {
  ja: ARCHETYPE_JA,
  en: ARCHETYPE_EN,
  ko: ARCHETYPE_KO,
  zh: ARCHETYPE_ZH,
  es: ARCHETYPE_ES,
  fr: ARCHETYPE_FR,
  de: ARCHETYPE_DE,
  pt: ARCHETYPE_PT,
  ru: ARCHETYPE_RU,
};

const ROLE_JA: Record<Role, string> = {
  Top: "Top",
  Jungle: "Jungle",
  Mid: "Mid",
  ADC: "ADC",
  Support: "Support",
};
const ROLE_EN: Record<Role, string> = {
  Top: "Top",
  Jungle: "Jungle",
  Mid: "Mid",
  ADC: "Bot",
  Support: "Support",
};
export const ROLE_LABEL: Record<Locale, Record<Role, string>> = {
  ja: ROLE_JA,
  en: ROLE_EN,
  // Lane names are kept in English across LoL communities; localized only where idiomatic.
  ko: ROLE_EN,
  zh: ROLE_EN,
  es: ROLE_EN,
  fr: ROLE_EN,
  de: ROLE_EN,
  pt: ROLE_EN,
  ru: ROLE_EN,
};

const STORY_DIM_JA: Record<StoryDim, string> = {
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
const STORY_DIM_EN: Record<StoryDim, string> = {
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
};
const STORY_DIM_KO: Record<StoryDim, string> = {
  honor: "명예",
  revenge: "복수",
  protection: "수호",
  freedom: "자유",
  knowledge: "지식",
  chaos: "혼돈",
  love: "사랑",
  justice: "정의",
  ambition: "야망",
  solitude: "고독",
  solo: "단독 행동",
  family: "가족 중시",
  organization: "질서",
  mentor: "사제 관계",
  rival: "라이벌 관계",
};
const STORY_DIM_ZH: Record<StoryDim, string> = {
  honor: "荣誉",
  revenge: "复仇",
  protection: "守护",
  freedom: "自由",
  knowledge: "知识",
  chaos: "混沌",
  love: "爱",
  justice: "正义",
  ambition: "野心",
  solitude: "孤独",
  solo: "独行",
  family: "重视家庭",
  organization: "秩序",
  mentor: "师徒关系",
  rival: "宿敌关系",
};
const STORY_DIM_ES: Record<StoryDim, string> = {
  honor: "Honor",
  revenge: "Venganza",
  protection: "Protección",
  freedom: "Libertad",
  knowledge: "Conocimiento",
  chaos: "Caos",
  love: "Amor",
  justice: "Justicia",
  ambition: "Ambición",
  solitude: "Soledad",
  solo: "En solitario",
  family: "Familia",
  organization: "Orden",
  mentor: "Tutoría",
  rival: "Rivalidad",
};
const STORY_DIM_FR: Record<StoryDim, string> = {
  honor: "Honneur",
  revenge: "Vengeance",
  protection: "Protection",
  freedom: "Liberté",
  knowledge: "Savoir",
  chaos: "Chaos",
  love: "Amour",
  justice: "Justice",
  ambition: "Ambition",
  solitude: "Solitude",
  solo: "En solo",
  family: "Famille",
  organization: "Ordre",
  mentor: "Mentorat",
  rival: "Rivalité",
};
const STORY_DIM_DE: Record<StoryDim, string> = {
  honor: "Ehre",
  revenge: "Rache",
  protection: "Schutz",
  freedom: "Freiheit",
  knowledge: "Wissen",
  chaos: "Chaos",
  love: "Liebe",
  justice: "Gerechtigkeit",
  ambition: "Ehrgeiz",
  solitude: "Einsamkeit",
  solo: "Alleingang",
  family: "Familie",
  organization: "Ordnung",
  mentor: "Mentorschaft",
  rival: "Rivalität",
};
const STORY_DIM_PT: Record<StoryDim, string> = {
  honor: "Honra",
  revenge: "Vingança",
  protection: "Proteção",
  freedom: "Liberdade",
  knowledge: "Conhecimento",
  chaos: "Caos",
  love: "Amor",
  justice: "Justiça",
  ambition: "Ambição",
  solitude: "Solidão",
  solo: "Em solo",
  family: "Família",
  organization: "Ordem",
  mentor: "Mentoria",
  rival: "Rivalidade",
};
const STORY_DIM_RU: Record<StoryDim, string> = {
  honor: "Честь",
  revenge: "Месть",
  protection: "Защита",
  freedom: "Свобода",
  knowledge: "Знание",
  chaos: "Хаос",
  love: "Любовь",
  justice: "Справедливость",
  ambition: "Амбиции",
  solitude: "Одиночество",
  solo: "Действие в одиночку",
  family: "Семья",
  organization: "Порядок",
  mentor: "Наставничество",
  rival: "Соперничество",
};
export const STORY_DIM_LABEL: Record<Locale, Record<StoryDim, string>> = {
  ja: STORY_DIM_JA,
  en: STORY_DIM_EN,
  ko: STORY_DIM_KO,
  zh: STORY_DIM_ZH,
  es: STORY_DIM_ES,
  fr: STORY_DIM_FR,
  de: STORY_DIM_DE,
  pt: STORY_DIM_PT,
  ru: STORY_DIM_RU,
};

type Axis = { low: string; high: string };
const GAME_DIM_AXIS_JA: Record<GameDim, Axis> = {
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
const GAME_DIM_AXIS_EN: Record<GameDim, Axis> = {
  range: { low: "Melee", high: "Ranged" },
  skillBased: { low: "Auto-attack", high: "Skill-based" },
  damageStyle: { low: "DPS", high: "Burst" },
  durability: { low: "Squishy", high: "Tanky" },
  damage: { low: "Utility", high: "High damage" },
  cc: { low: "Low CC", high: "High CC" },
  mobility: { low: "Slow", high: "Mobile" },
  difficulty: { low: "Easy", high: "Hard" },
  scaling: { low: "Early game", high: "Late game" },
};
const GAME_DIM_AXIS_KO: Record<GameDim, Axis> = {
  range: { low: "근접", high: "원거리" },
  skillBased: { low: "평타 중심", high: "스킬 중심" },
  damageStyle: { low: "DPS", high: "버스트" },
  durability: { low: "물몸", high: "탱키" },
  damage: { low: "유틸형", high: "고화력" },
  cc: { low: "CC 약함", high: "CC 강함" },
  mobility: { low: "둔함", high: "기동성" },
  difficulty: { low: "쉬움", high: "어려움" },
  scaling: { low: "초반형", high: "후반형" },
};
const GAME_DIM_AXIS_ZH: Record<GameDim, Axis> = {
  range: { low: "近战", high: "远程" },
  skillBased: { low: "普攻为主", high: "技能为主" },
  damageStyle: { low: "DPS", high: "爆发" },
  durability: { low: "脆皮", high: "肉" },
  damage: { low: "功能型", high: "高伤害" },
  cc: { low: "控制弱", high: "控制强" },
  mobility: { low: "笨重", high: "灵活" },
  difficulty: { low: "简单", high: "困难" },
  scaling: { low: "前期型", high: "后期型" },
};
const GAME_DIM_AXIS_ES: Record<GameDim, Axis> = {
  range: { low: "Cuerpo a cuerpo", high: "A distancia" },
  skillBased: { low: "Ataque básico", high: "Habilidades" },
  damageStyle: { low: "DPS", high: "Burst" },
  durability: { low: "Frágil", high: "Resistente" },
  damage: { low: "Utilidad", high: "Mucho daño" },
  cc: { low: "Poco CC", high: "Mucho CC" },
  mobility: { low: "Lento", high: "Móvil" },
  difficulty: { low: "Fácil", high: "Difícil" },
  scaling: { low: "Inicio", high: "Final" },
};
const GAME_DIM_AXIS_FR: Record<GameDim, Axis> = {
  range: { low: "Mêlée", high: "À distance" },
  skillBased: { low: "Attaque auto", high: "Compétences" },
  damageStyle: { low: "DPS", high: "Burst" },
  durability: { low: "Fragile", high: "Résistant" },
  damage: { low: "Utilitaire", high: "Gros dégâts" },
  cc: { low: "Peu de CC", high: "Beaucoup de CC" },
  mobility: { low: "Lent", high: "Mobile" },
  difficulty: { low: "Facile", high: "Difficile" },
  scaling: { low: "Début de partie", high: "Fin de partie" },
};
const GAME_DIM_AXIS_DE: Record<GameDim, Axis> = {
  range: { low: "Nahkampf", high: "Fernkampf" },
  skillBased: { low: "Auto-Angriff", high: "Fähigkeiten" },
  damageStyle: { low: "DPS", high: "Burst" },
  durability: { low: "Zerbrechlich", high: "Robust" },
  damage: { low: "Unterstützung", high: "Hoher Schaden" },
  cc: { low: "Wenig CC", high: "Viel CC" },
  mobility: { low: "Träge", high: "Beweglich" },
  difficulty: { low: "Leicht", high: "Schwer" },
  scaling: { low: "Frühes Spiel", high: "Spätes Spiel" },
};
const GAME_DIM_AXIS_PT: Record<GameDim, Axis> = {
  range: { low: "Corpo a corpo", high: "À distância" },
  skillBased: { low: "Ataque básico", high: "Habilidades" },
  damageStyle: { low: "DPS", high: "Burst" },
  durability: { low: "Frágil", high: "Resistente" },
  damage: { low: "Utilidade", high: "Muito dano" },
  cc: { low: "Pouco CC", high: "Muito CC" },
  mobility: { low: "Lento", high: "Móvel" },
  difficulty: { low: "Fácil", high: "Difícil" },
  scaling: { low: "Início de jogo", high: "Fim de jogo" },
};
const GAME_DIM_AXIS_RU: Record<GameDim, Axis> = {
  range: { low: "Ближний бой", high: "Дальний бой" },
  skillBased: { low: "Автоатаки", high: "Умения" },
  damageStyle: { low: "DPS", high: "Бёрст" },
  durability: { low: "Хрупкий", high: "Живучий" },
  damage: { low: "Утилити", high: "Высокий урон" },
  cc: { low: "Слабый CC", high: "Сильный CC" },
  mobility: { low: "Медленный", high: "Подвижный" },
  difficulty: { low: "Лёгкий", high: "Сложный" },
  scaling: { low: "Ранняя игра", high: "Поздняя игра" },
};
export const GAME_DIM_AXIS: Record<Locale, Record<GameDim, Axis>> = {
  ja: GAME_DIM_AXIS_JA,
  en: GAME_DIM_AXIS_EN,
  ko: GAME_DIM_AXIS_KO,
  zh: GAME_DIM_AXIS_ZH,
  es: GAME_DIM_AXIS_ES,
  fr: GAME_DIM_AXIS_FR,
  de: GAME_DIM_AXIS_DE,
  pt: GAME_DIM_AXIS_PT,
  ru: GAME_DIM_AXIS_RU,
};

// ────────────────────────────────────────────────────────────────────────────
// UI string dictionary. `ja` and `en` are authoritative; the other 7 locales
// currently mirror `en` (see the `T` map below) until the translation pass.

const ja = {
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
    shikkariBody:
      "両方の入り口を診断 → 結果が一致したチャンピオンを強調表示。性格 × プレイ志向の精度が最大化されます。",
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
    faqHeading: "よくある質問",
    faq: [
      {
        q: "この診断は公式ですか？",
        a: "いいえ。Riot Games 非公式のファンプロジェクトです。チャンピオン画像は Data Dragon から配信されています。",
      },
      {
        q: "診断結果は保存されますか？",
        a: "いいえ。回答はURLのハッシュにだけ埋め込まれ、サーバーには何も保存されません。同じURLを開けば常に同じ結果が出ます。",
      },
      {
        q: "ストーリー入り口とゲーム性能入り口の違いは？",
        a: "ストーリーは性格・価値観・関係性で、ゲーム性能はプレイスタイルや好きな役割で診断します。両方やると、結果が一致したチャンピオンを強調表示します。",
      },
      {
        q: "何問ありますか？",
        a: "各入り口10問、両方で20問です。3〜6分で終わります。",
      },
      {
        q: "日本語以外でも使えますか？",
        a: "はい。ヘッダー右上で言語を切り替えられます (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский)。",
      },
    ],
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
    keyboardHint: "1〜5キーで回答、← → キーで前後の質問へ移動できます。",
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
    browseAll: "→ 全チャンピオン一覧を見る",
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
    stillNeedBody: (label: string) =>
      `${label}入り口がまだです。両方診断すると並列比較が表示されます。`,
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
    metaDescription:
      "League of Legends 全172チャンピオンの一覧。ロール・リージョン・アーキタイプで絞り込み、各チャンピオンの性能8軸とストーリー特性を確認できます。",
    detail: {
      back: "← ホームに戻る",
      stats: "⚔️ 性能8軸",
      story: "🌍 ストーリー特性",
      similar: "プレイスタイルが近いチャンピオン",
      sameRegion: (region: string) => `${region}のチャンピオン`,
      shareCta: "このタイプをシェア",
      shareText: (name: string) => `私は${name}タイプ #LOLキャラタイプ診断`,
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
    trademark: "リーグ・オブ・レジェンド及びライアットゲームズはRiot Games, Inc.の商標です。",
    ddragonPrefix: "チャンピオン画像は",
    ddragonMid: "より配信。本サイトは",
    ddragonSuffix: "に基づき制作されたファンプロジェクトです。",
  },
  a11y: {
    skipToContent: "本文へスキップ",
  },
  notFound: {
    heading: "ページが見つかりません",
    body: "お探しのページは存在しないか、移動した可能性があります。",
    home: "ホームへ",
    champions: "チャンピオン一覧へ",
    quiz: "診断をはじめる",
  },
  errorPage: {
    heading: "問題が発生しました",
    body: "予期しないエラーが発生しました。もう一度お試しください。",
    retry: "もう一度試す",
    home: "ホームへ",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const en = {
  siteName: "LoL Character Type Quiz",
  unofficial: "Unofficial",
  version: "v0.1 MVP",
  home: {
    heading1: "Find the League of Legends",
    heading2: "champion that matches you",
    lead: "Two entries — story and gameplay — pick the closest champion out of 172 with vector matching. 10 questions per entry.",
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
    faqHeading: "FAQ",
    faq: [
      {
        q: "Is this an official Riot Games quiz?",
        a: "No — it's an unofficial fan project. Champion portraits are served by Data Dragon.",
      },
      {
        q: "Are my results saved anywhere?",
        a: "No. Your answers are encoded into the URL hash only; nothing is stored on a server. Open the same URL and you'll always get the same result.",
      },
      {
        q: "What's the difference between the story and gameplay entries?",
        a: "The story entry matches on values, personality, and relationships; the gameplay entry matches on playstyle and preferred role. Take both and the champions that overlap get highlighted.",
      },
      {
        q: "How many questions are there?",
        a: "10 per entry, 20 in total. It takes 3–6 minutes.",
      },
      {
        q: "Can I use it in other languages?",
        a: "Yes — switch the language from the header (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
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
    keyboardHint: "Press 1–5 to answer; use ← → to move between questions.",
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
    browseAll: "→ Browse all champions",
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
    metaDescription:
      "All 172 League of Legends champions. Filter by role, region, and archetype, and see each champion's 8-axis gameplay profile and story traits.",
    detail: {
      back: "← Back to home",
      stats: "⚔️ 8 gameplay axes",
      story: "🌍 Story traits",
      similar: "Champions with a similar playstyle",
      sameRegion: (region: string) => `More champions from ${region}`,
      shareCta: "Share this type",
      shareText: (name: string) => `I'm a ${name} type #LoLCharacterType`,
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
  a11y: {
    skipToContent: "Skip to content",
  },
  notFound: {
    heading: "Page not found",
    body: "The page you're looking for doesn't exist or may have moved.",
    home: "Go home",
    champions: "Browse champions",
    quiz: "Start the quiz",
  },
  errorPage: {
    heading: "Something went wrong",
    body: "An unexpected error occurred. Please try again.",
    retry: "Try again",
    home: "Go home",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

export type Dict = typeof en;

const ko: Dict = {
  siteName: "LoL 캐릭터 타입 진단",
  unofficial: "비공식",
  version: "v0.1 MVP",
  home: {
    heading1: "당신과 어울리는",
    heading2: "리그 오브 레전드 챔피언을 찾아보세요",
    lead: "스토리와 게임 성능, 두 가지 입구로 진행하는 진단. 172명의 챔피언 중 벡터 매칭으로 가장 잘 맞는 1명 + 상위 5명을 제시합니다. 입구당 10문항.",
    pickedBadge: "최애",
    shikkari: "🎯 정밀 진단",
    shikkariMeta: "20문항 · 약 6분",
    shikkariBody:
      "두 입구를 모두 진단 → 결과가 겹치는 챔피언을 강조 표시. 성격 × 게임 성향의 정밀도가 최대화됩니다.",
    shikkariPick: "어디부터 시작할까요?",
    quick: "⚡ 빠른 진단",
    quickMeta: "10문항 · 약 3분",
    quickBody: "한쪽만 가볍게 해보고 싶은 분께.",
    storyTitle: "스토리",
    storyDesc: "가치관·성격·관계 성향에 관한 10문항",
    gameTitle: "게임 성능",
    gameDesc: "플레이 스타일·선호 역할에 관한 10문항",
    startHere: "여기서 시작 →",
    onlyStory: "🌍 스토리만",
    onlyGame: "⚔️ 게임 성능만",
    compareLink: "→ 둘 다 진단했다면 비교 보기",
    championsLink: "→ 전체 172 챔피언 목록",
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "이 진단은 공식인가요?",
        a: "아니요. Riot Games 비공식 팬 프로젝트입니다. 챔피언 이미지는 Data Dragon에서 제공됩니다.",
      },
      {
        q: "진단 결과가 어딘가에 저장되나요?",
        a: "아니요. 답변은 URL 해시에만 인코딩되며 서버에는 아무것도 저장되지 않습니다. 같은 URL을 열면 항상 같은 결과가 나옵니다.",
      },
      {
        q: "스토리 입구와 게임 성능 입구의 차이는 무엇인가요?",
        a: "스토리 입구는 가치관·성격·관계로 매칭하고, 게임 성능 입구는 플레이 스타일과 선호 역할로 매칭합니다. 둘 다 하면 겹치는 챔피언이 강조 표시됩니다.",
      },
      {
        q: "문항은 몇 개인가요?",
        a: "입구당 10문항, 총 20문항입니다. 3~6분이면 끝납니다.",
      },
      {
        q: "다른 언어로도 쓸 수 있나요?",
        a: "네. 헤더에서 언어를 전환할 수 있습니다 (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 스토리 입구",
    gameTitle: "⚔️ 게임 성능 입구",
    storyLead: "가치관·성격·관계 성향에 관한 10문항. 직감으로 답하세요.",
    gameLead: "플레이 스타일·선호 역할에 관한 10문항. 직감으로 답하세요.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← 이전",
    next: "다음 →",
    submit: "결과 보기",
    missing: "답하지 않은 문항이 있습니다. 돌아가서 완료해 주세요.",
    keyboardHint: "1~5 키로 답하고, ← → 키로 문항을 이동할 수 있습니다.",
  },
  likert: ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"],
  result: {
    typeStory: "스토리 입구 — 진단 결과",
    typeGame: "게임 성능 입구 — 진단 결과",
    youAre: "당신은",
    typeSuffix: " 타입",
    bestMatch: "가장 잘 맞는 챔피언",
    tweetCta: "X에 공유",
    championDetail: "챔피언 상세",
    retake: "다시 진단",
    profile8: "⚔️ 당신의 8축 프로필",
    nextClose: (n: number) => `그다음으로 가까운 타입 (${n}명)`,
    oppositeHeading: "⚠️ 당신의 완전한 반대 타입",
    oppositeNote: (d: string) => `서로 이해하기 어려울지도 (거리 ${d})`,
    crossLead: "정밀 진단 (20문항) 이어서",
    crossBody: "다른 입구도 진단하면 성격 vs 플레이 스타일을 나란히 볼 수 있습니다.",
    crossCta: (other: string) => `${other} 입구에서 찾기 →`,
    bothDone: "이미 둘 다 했나요?",
    compareLink: "비교 보기",
    browseAll: "→ 전체 챔피언 목록 보기",
    typeLabel: { story: "스토리", game: "게임 성능" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `「${label}」 타입 → ${name}와 매칭 (상위 3: ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "스토리 × 게임 성능",
    caption: "크로스 입구 비교",
    perfect: "🎯 완전 일치",
    youAre: (name: string) => `당신은 ${name}의 화신`,
    overlapNote: (ids: string) => `두 입구 상위 3에 공통: ${ids}`,
    noOverlap: "상위 3에 공통되는 챔피언이 없습니다 — 스토리와 게임 성능에서 다른 인격!",
    bothMissing: "아직 어느 진단도 하지 않았습니다.",
    stillNeedHeading: "비교까지 한 걸음 남았습니다",
    stillNeedBody: (label: string) =>
      `${label} 입구가 아직입니다. 둘 다 진단하면 나란히 비교가 표시됩니다.`,
    goCta: (label: string) => `${label} 입구 진단 →`,
    loading: "불러오는 중…",
  },
  champions: {
    heading: "전체 챔피언 목록",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "이름으로 검색 (예: 가렌, Yasuo)",
    filterRole: "역할",
    filterRegion: "지역",
    filterArchetype: "아키타입",
    all: "전체",
    empty: "해당하는 챔피언이 없습니다.",
    metaDescription:
      "리그 오브 레전드 전체 172 챔피언 목록. 역할·지역·아키타입으로 필터링하고 각 챔피언의 8축 게임 성능 프로필과 스토리 특성을 확인하세요.",
    detail: {
      back: "← 홈으로",
      stats: "⚔️ 8개 성능 축",
      story: "🌍 스토리 특성",
      similar: "플레이 스타일이 비슷한 챔피언",
      sameRegion: (region: string) => `${region}의 다른 챔피언`,
      shareCta: "이 타입 공유하기",
      shareText: (name: string) => `나는 ${name} 타입 #LoLCharacterType`,
    },
  },
  metadata: {
    title: "LoL 캐릭터 타입 진단",
    description:
      "당신의 성격과 플레이 스타일에 가장 가까운 리그 오브 레전드 챔피언을 진단합니다. 스토리(세계관)와 게임 성능(역할/아키타입), 두 가지 입구에서 선택할 수 있습니다.",
    ogDescription:
      "당신과 LoL 챔피언을 잇는 세계관 입구 진단. 10문항 × 2입구로 성격과 플레이 성향에 딱 맞는 챔피언을 제시합니다.",
  },
  legal: {
    disclaimerSuffix:
      "은(는) Riot Games의 승인을 받지 않았으며, 리그 오브 레전드의 제작 또는 운영에 공식적으로 관여한 Riot Games 또는 그 누구의 견해나 의견을 반영하지 않습니다.",
    trademark: "리그 오브 레전드와 Riot Games는 Riot Games, Inc.의 상표입니다.",
    ddragonPrefix: "챔피언 이미지 제공: ",
    ddragonMid: ". 본 사이트는 다음에 따라 제작된 팬 프로젝트입니다: ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "본문으로 건너뛰기",
  },
  notFound: {
    heading: "페이지를 찾을 수 없습니다",
    body: "찾으시는 페이지가 존재하지 않거나 이동했을 수 있습니다.",
    home: "홈으로",
    champions: "챔피언 목록",
    quiz: "진단 시작하기",
  },
  errorPage: {
    heading: "문제가 발생했습니다",
    body: "예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.",
    retry: "다시 시도",
    home: "홈으로",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const zh: Dict = {
  siteName: "LoL 角色类型测试",
  unofficial: "非官方",
  version: "v0.1 MVP",
  home: {
    heading1: "找到与你契合的",
    heading2: "英雄联盟英雄",
    lead: "故事与玩法两个入口的测试。通过向量匹配，从 172 名英雄中给出最契合的 1 名 + 前 5 名。每个入口 10 道题。",
    pickedBadge: "本命",
    shikkari: "🎯 完整测试",
    shikkariMeta: "20 道题 · 约 6 分钟",
    shikkariBody: "做完两个入口 → 在前 3 名中重叠的英雄会被高亮。让性格 × 玩法的契合度最大化。",
    shikkariPick: "想从哪里开始？",
    quick: "⚡ 快速测试",
    quickMeta: "10 道题 · 约 3 分钟",
    quickBody: "适合只想试一边的人。",
    storyTitle: "故事",
    storyDesc: "关于价值观、性格与人际关系的 10 道题",
    gameTitle: "玩法",
    gameDesc: "关于游戏风格与偏好定位的 10 道题",
    startHere: "从这里开始 →",
    onlyStory: "🌍 仅故事",
    onlyGame: "⚔️ 仅玩法",
    compareLink: "→ 两个都做完后查看对比",
    championsLink: "→ 全部 172 名英雄",
    faqHeading: "常见问题",
    faq: [
      {
        q: "这是官方测试吗？",
        a: "不是 —— 这是非官方的粉丝项目。英雄头像由 Data Dragon 提供。",
      },
      {
        q: "我的结果会被保存吗？",
        a: "不会。你的答案只编码在 URL 哈希中，服务器不保存任何内容。打开同一个 URL，你总会得到相同的结果。",
      },
      {
        q: "故事入口和玩法入口有什么区别？",
        a: "故事入口根据价值观、性格与人际关系匹配；玩法入口根据游戏风格与偏好定位匹配。两个都做，重叠的英雄会被高亮。",
      },
      {
        q: "一共有多少道题？",
        a: "每个入口 10 道，共 20 道。需要 3 到 6 分钟。",
      },
      {
        q: "可以用其他语言吗？",
        a: "可以 —— 在页眉切换语言（日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский）。",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 故事入口",
    gameTitle: "⚔️ 玩法入口",
    storyLead: "关于价值观、性格与人际关系的 10 道题。凭直觉作答即可。",
    gameLead: "关于游戏风格与偏好定位的 10 道题。凭直觉作答即可。",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← 上一题",
    next: "下一题 →",
    submit: "查看结果",
    missing: "还有未作答的题目。请返回完成它们。",
    keyboardHint: "按 1–5 作答；用 ← → 在题目间移动。",
  },
  likert: ["非常不同意", "不同意", "中立", "同意", "非常同意"],
  result: {
    typeStory: "故事入口 — 你的结果",
    typeGame: "玩法入口 — 你的结果",
    youAre: "你是",
    typeSuffix: " 型",
    bestMatch: "最契合的英雄",
    tweetCta: "分享到 X",
    championDetail: "英雄详情",
    retake: "重新测试",
    profile8: "⚔️ 你的 8 轴档案",
    nextClose: (n: number) => `接下来最接近的类型（${n} 名）`,
    oppositeHeading: "⚠️ 你的完全相反型",
    oppositeNote: (d: string) => `也许彼此难以理解（距离 ${d}）`,
    crossLead: "继续完整测试（20 道题）",
    crossBody: "也做另一个入口 —— 你将并排看到自己的性格与玩法。",
    crossCta: (other: string) => `从${other}入口寻找 →`,
    bothDone: "两个都做过了？",
    compareLink: "对比视图",
    browseAll: "→ 浏览全部英雄",
    typeLabel: { story: "故事", game: "玩法" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `「${label}」型 → 匹配到 ${name}（前 3：${top3}）#LoLCharacterType`,
  },
  compare: {
    heading: "故事 × 玩法",
    caption: "跨入口对比",
    perfect: "🎯 完全一致",
    youAre: (name: string) => `你是 ${name} 的化身`,
    overlapNote: (ids: string) => `两个入口前 3 共有：${ids}`,
    noOverlap: "前 3 名中没有共有的英雄 —— 故事与玩法之间的双重人格！",
    bothMissing: "你还没做过任何一个测试。",
    stillNeedHeading: "距离对比还差一步",
    stillNeedBody: (label: string) => `还缺${label}入口。两个都做完才会显示并排对比。`,
    goCta: (label: string) => `做${label}入口 →`,
    loading: "加载中…",
  },
  champions: {
    heading: "全部英雄",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "按名称搜索（例如：盖伦、Yasuo）",
    filterRole: "定位",
    filterRegion: "地区",
    filterArchetype: "类型",
    all: "全部",
    empty: "没有匹配的英雄。",
    metaDescription:
      "英雄联盟全部 172 名英雄。按定位、地区与类型筛选，查看每名英雄的 8 轴玩法档案与故事特征。",
    detail: {
      back: "← 返回首页",
      stats: "⚔️ 8 个玩法轴",
      story: "🌍 故事特征",
      similar: "玩法相似的英雄",
      sameRegion: (region: string) => `更多来自${region}的英雄`,
      shareCta: "分享这个类型",
      shareText: (name: string) => `我是 ${name} 型 #LoLCharacterType`,
    },
  },
  metadata: {
    title: "LoL 角色类型测试",
    description:
      "找到与你的性格和玩法最接近的英雄联盟英雄。两个入口：故事（世界观）和玩法（定位/类型）。",
    ogDescription: "找到你的英雄联盟角色类型。10 道题 × 2 个入口，与 172 名英雄进行向量匹配。",
  },
  legal: {
    disclaimerSuffix:
      "未获 Riot Games 认可，亦不代表 Riot Games 或任何正式参与制作或运营英雄联盟之人的观点或意见。",
    trademark: "英雄联盟与 Riot Games 是 Riot Games, Inc. 的商标。",
    ddragonPrefix: "英雄头像由 ",
    ddragonMid: " 提供。本站是符合 ",
    ddragonSuffix: " 的粉丝项目。",
  },
  a11y: {
    skipToContent: "跳到正文",
  },
  notFound: {
    heading: "找不到页面",
    body: "你要找的页面不存在，或可能已被移动。",
    home: "回首页",
    champions: "浏览英雄",
    quiz: "开始测试",
  },
  errorPage: {
    heading: "出错了",
    body: "发生了意外错误。请重试。",
    retry: "重试",
    home: "回首页",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const es: Dict = {
  siteName: "Test de tipo de personaje de LoL",
  unofficial: "No oficial",
  version: "v0.1 MVP",
  home: {
    heading1: "Encuentra el campeón de",
    heading2: "League of Legends que encaja contigo",
    lead: "Dos entradas — historia y jugabilidad — eligen el campeón más cercano de entre 172 mediante emparejamiento vectorial. 10 preguntas por entrada.",
    pickedBadge: "Favorito",
    shikkari: "🎯 Test completo",
    shikkariMeta: "20 preguntas · ~6 min",
    shikkariBody:
      "Haz ambas entradas — los campeones que coinciden en el top 3 se resaltan. Maximiza el ajuste personalidad × jugabilidad.",
    shikkariPick: "¿Por dónde quieres empezar?",
    quick: "⚡ Test rápido",
    quickMeta: "10 preguntas · ~3 min",
    quickBody: "Para cuando solo quieres probar un lado.",
    storyTitle: "Historia",
    storyDesc: "10 preguntas sobre valores, personalidad y relaciones",
    gameTitle: "Jugabilidad",
    gameDesc: "10 preguntas sobre estilo de juego y rol preferido",
    startHere: "Empieza aquí →",
    onlyStory: "🌍 Solo historia",
    onlyGame: "⚔️ Solo jugabilidad",
    compareLink: "→ Vista de comparación (tras hacer ambas)",
    championsLink: "→ Los 172 campeones",
    faqHeading: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Es un test oficial de Riot Games?",
        a: "No: es un proyecto de fans no oficial. Los retratos de campeones los sirve Data Dragon.",
      },
      {
        q: "¿Se guardan mis resultados en algún sitio?",
        a: "No. Tus respuestas se codifican solo en el hash de la URL; no se almacena nada en un servidor. Abre la misma URL y siempre obtendrás el mismo resultado.",
      },
      {
        q: "¿Cuál es la diferencia entre la entrada de historia y la de jugabilidad?",
        a: "La entrada de historia empareja según valores, personalidad y relaciones; la de jugabilidad, según el estilo de juego y el rol preferido. Haz ambas y los campeones que coinciden se resaltan.",
      },
      {
        q: "¿Cuántas preguntas hay?",
        a: "10 por entrada, 20 en total. Lleva de 3 a 6 minutos.",
      },
      {
        q: "¿Puedo usarlo en otros idiomas?",
        a: "Sí: cambia el idioma desde la cabecera (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 Entrada de historia",
    gameTitle: "⚔️ Entrada de jugabilidad",
    storyLead: "10 preguntas sobre valores, personalidad y relaciones. Fíate de tu instinto.",
    gameLead: "10 preguntas sobre estilo de juego y rol preferido. Fíate de tu instinto.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← Anterior",
    next: "Siguiente →",
    submit: "Ver resultado",
    missing: "Hay preguntas sin responder. Vuelve y termínalas.",
    keyboardHint: "Pulsa 1–5 para responder; usa ← → para moverte entre preguntas.",
  },
  likert: [
    "Muy en desacuerdo",
    "En desacuerdo",
    "Ni una cosa ni otra",
    "De acuerdo",
    "Muy de acuerdo",
  ],
  result: {
    typeStory: "Entrada de historia — tu resultado",
    typeGame: "Entrada de jugabilidad — tu resultado",
    youAre: "Eres",
    typeSuffix: "",
    bestMatch: "Campeón más afín",
    tweetCta: "Compartir en X",
    championDetail: "Detalles del campeón",
    retake: "Repetir",
    profile8: "⚔️ Tu perfil de 8 ejes",
    nextClose: (n: number) => `Siguientes más cercanos (${n})`,
    oppositeHeading: "⚠️ Tu opuesto absoluto",
    oppositeNote: (d: string) => `Puede que no os entendáis (distancia ${d})`,
    crossLead: "Continúa el test completo (20 preguntas)",
    crossBody:
      "Haz también la otra entrada — verás tu personalidad y tu estilo de juego lado a lado.",
    crossCta: (other: string) => `Prueba la entrada de ${other} →`,
    bothDone: "¿Ya has hecho ambas?",
    compareLink: "Vista de comparación",
    browseAll: "→ Ver todos los campeones",
    typeLabel: { story: "historia", game: "jugabilidad" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `Soy de tipo "${label}" → me tocó ${name} (top 3: ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "Historia × Jugabilidad",
    caption: "Comparación entre entradas",
    perfect: "🎯 Coincidencia perfecta",
    youAre: (name: string) => `Encarnas a ${name}`,
    overlapNote: (ids: string) => `Campeones en ambos top 3: ${ids}`,
    noOverlap:
      "Ningún campeón aparece en ambos top 3 — ¡personalidad partida entre historia y jugabilidad!",
    bothMissing: "Aún no has hecho ninguno de los dos tests.",
    stillNeedHeading: "Un paso más antes de comparar",
    stillNeedBody: (label: string) =>
      `Falta la entrada de ${label}. Haz las dos para ver la comparación lado a lado.`,
    goCta: (label: string) => `Hacer la entrada de ${label} →`,
    loading: "Cargando…",
  },
  champions: {
    heading: "Todos los campeones",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "Buscar por nombre (p. ej. Garen, ヤスオ)",
    filterRole: "Rol",
    filterRegion: "Región",
    filterArchetype: "Arquetipo",
    all: "Todos",
    empty: "Ningún campeón coincide.",
    metaDescription:
      "Los 172 campeones de League of Legends. Filtra por rol, región y arquetipo, y consulta el perfil de jugabilidad de 8 ejes y los rasgos de historia de cada campeón.",
    detail: {
      back: "← Volver al inicio",
      stats: "⚔️ 8 ejes de jugabilidad",
      story: "🌍 Rasgos de historia",
      similar: "Campeones con un estilo de juego parecido",
      sameRegion: (region: string) => `Más campeones de ${region}`,
      shareCta: "Compartir este tipo",
      shareText: (name: string) => `Soy de tipo ${name} #LoLCharacterType`,
    },
  },
  metadata: {
    title: "Test de tipo de personaje de LoL",
    description:
      "Descubre el campeón de League of Legends más cercano a tu personalidad y tu estilo de juego. Dos puntos de entrada: historia (cosmovisión) y jugabilidad (rol/arquetipo).",
    ogDescription:
      "Descubre tu tipo de personaje de League of Legends. 10 preguntas × 2 entradas, emparejadas por vectores con 172 campeones.",
  },
  legal: {
    disclaimerSuffix:
      " no cuenta con el respaldo de Riot Games ni refleja las opiniones o puntos de vista de Riot Games ni de nadie involucrado oficialmente en la producción o gestión de League of Legends.",
    trademark: "League of Legends y Riot Games son marcas registradas de Riot Games, Inc.",
    ddragonPrefix: "Retratos de campeones servidos por ",
    ddragonMid: ". Este sitio es un proyecto de fans conforme con ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "Saltar al contenido",
  },
  notFound: {
    heading: "Página no encontrada",
    body: "La página que buscas no existe o puede que se haya movido.",
    home: "Ir al inicio",
    champions: "Ver campeones",
    quiz: "Empezar el test",
  },
  errorPage: {
    heading: "Algo ha salido mal",
    body: "Se ha producido un error inesperado. Inténtalo de nuevo.",
    retry: "Reintentar",
    home: "Ir al inicio",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const fr: Dict = {
  siteName: "Test de type de personnage LoL",
  unofficial: "Non officiel",
  version: "v0.1 MVP",
  home: {
    heading1: "Trouvez le champion de",
    heading2: "League of Legends qui vous correspond",
    lead: "Deux entrées — histoire et gameplay — choisissent le champion le plus proche parmi 172 grâce à un appariement vectoriel. 10 questions par entrée.",
    pickedBadge: "Favori",
    shikkari: "🎯 Test complet",
    shikkariMeta: "20 questions · ~6 min",
    shikkariBody:
      "Faites les deux entrées — les champions qui se recoupent dans le top 3 sont mis en avant. Maximise l'accord personnalité × gameplay.",
    shikkariPick: "Par où voulez-vous commencer ?",
    quick: "⚡ Test rapide",
    quickMeta: "10 questions · ~3 min",
    quickBody: "Pour quand vous ne voulez essayer qu'un seul côté.",
    storyTitle: "Histoire",
    storyDesc: "10 questions sur les valeurs, la personnalité et les relations",
    gameTitle: "Gameplay",
    gameDesc: "10 questions sur le style de jeu et le rôle préféré",
    startHere: "Commencez ici →",
    onlyStory: "🌍 Histoire seulement",
    onlyGame: "⚔️ Gameplay seulement",
    compareLink: "→ Vue comparée (après les deux)",
    championsLink: "→ Les 172 champions",
    faqHeading: "FAQ",
    faq: [
      {
        q: "Est-ce un test officiel de Riot Games ?",
        a: "Non — c'est un projet de fans non officiel. Les portraits de champions sont servis par Data Dragon.",
      },
      {
        q: "Mes résultats sont-ils enregistrés quelque part ?",
        a: "Non. Vos réponses sont encodées uniquement dans le hash de l'URL ; rien n'est stocké sur un serveur. Ouvrez la même URL et vous obtiendrez toujours le même résultat.",
      },
      {
        q: "Quelle est la différence entre l'entrée histoire et l'entrée gameplay ?",
        a: "L'entrée histoire fait correspondre selon les valeurs, la personnalité et les relations ; l'entrée gameplay selon le style de jeu et le rôle préféré. Faites les deux et les champions qui se recoupent sont mis en avant.",
      },
      {
        q: "Combien y a-t-il de questions ?",
        a: "10 par entrée, 20 au total. Cela prend 3 à 6 minutes.",
      },
      {
        q: "Puis-je l'utiliser dans d'autres langues ?",
        a: "Oui — changez la langue depuis l'en-tête (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 Entrée histoire",
    gameTitle: "⚔️ Entrée gameplay",
    storyLead:
      "10 questions sur les valeurs, la personnalité et les relations. Fiez-vous à votre instinct.",
    gameLead: "10 questions sur le style de jeu et le rôle préféré. Fiez-vous à votre instinct.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← Précédent",
    next: "Suivant →",
    submit: "Voir le résultat",
    missing: "Des questions sont sans réponse. Revenez les terminer.",
    keyboardHint:
      "Appuyez sur 1–5 pour répondre ; utilisez ← → pour passer d'une question à l'autre.",
  },
  likert: [
    "Pas du tout d'accord",
    "Pas d'accord",
    "Ni l'un ni l'autre",
    "D'accord",
    "Tout à fait d'accord",
  ],
  result: {
    typeStory: "Entrée histoire — votre résultat",
    typeGame: "Entrée gameplay — votre résultat",
    youAre: "Vous êtes",
    typeSuffix: "",
    bestMatch: "Champion le plus proche",
    tweetCta: "Partager sur X",
    championDetail: "Détails du champion",
    retake: "Refaire",
    profile8: "⚔️ Votre profil à 8 axes",
    nextClose: (n: number) => `Les plus proches ensuite (${n})`,
    oppositeHeading: "⚠️ Votre opposé total",
    oppositeNote: (d: string) => `Vous pourriez ne pas vous entendre (distance ${d})`,
    crossLead: "Poursuivez le test complet (20 questions)",
    crossBody:
      "Faites aussi l'autre entrée — vous verrez votre personnalité et votre style de jeu côte à côte.",
    crossCta: (other: string) => `Essayer l'entrée ${other} →`,
    bothDone: "Déjà fait les deux ?",
    compareLink: "Vue comparée",
    browseAll: "→ Parcourir tous les champions",
    typeLabel: { story: "histoire", game: "gameplay" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `Je suis de type « ${label} » → tombé sur ${name} (top 3 : ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "Histoire × Gameplay",
    caption: "Comparaison entre entrées",
    perfect: "🎯 Correspondance parfaite",
    youAre: (name: string) => `Vous incarnez ${name}`,
    overlapNote: (ids: string) => `Champions dans les deux top 3 : ${ids}`,
    noOverlap:
      "Aucun champion n'apparaît dans les deux top 3 — personnalité partagée entre histoire et gameplay !",
    bothMissing: "Vous n'avez encore fait aucun des deux tests.",
    stillNeedHeading: "Encore une étape avant de comparer",
    stillNeedBody: (label: string) =>
      `Il manque l'entrée ${label}. Faites les deux pour voir la comparaison côte à côte.`,
    goCta: (label: string) => `Faire l'entrée ${label} →`,
    loading: "Chargement…",
  },
  champions: {
    heading: "Tous les champions",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "Rechercher par nom (ex. : Garen, ヤスオ)",
    filterRole: "Rôle",
    filterRegion: "Région",
    filterArchetype: "Archétype",
    all: "Tous",
    empty: "Aucun champion ne correspond.",
    metaDescription:
      "Les 172 champions de League of Legends. Filtrez par rôle, région et archétype, et consultez le profil de gameplay à 8 axes et les traits d'histoire de chaque champion.",
    detail: {
      back: "← Retour à l'accueil",
      stats: "⚔️ 8 axes de gameplay",
      story: "🌍 Traits d'histoire",
      similar: "Champions au style de jeu proche",
      sameRegion: (region: string) => `Plus de champions de ${region}`,
      shareCta: "Partager ce type",
      shareText: (name: string) => `Je suis de type ${name} #LoLCharacterType`,
    },
  },
  metadata: {
    title: "Test de type de personnage LoL",
    description:
      "Trouvez le champion de League of Legends le plus proche de votre personnalité et de votre style de jeu. Deux points d'entrée : histoire (univers) et gameplay (rôle/archétype).",
    ogDescription:
      "Trouvez votre type de personnage League of Legends. 10 questions × 2 entrées, appariées par vecteurs avec 172 champions.",
  },
  legal: {
    disclaimerSuffix:
      " n'est pas approuvé par Riot Games et ne reflète pas les opinions ou les points de vue de Riot Games ni de quiconque participe officiellement à la production ou à la gestion de League of Legends.",
    trademark: "League of Legends et Riot Games sont des marques de Riot Games, Inc.",
    ddragonPrefix: "Portraits de champions servis par ",
    ddragonMid: ". Ce site est un projet de fans conforme à ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "Aller au contenu",
  },
  notFound: {
    heading: "Page introuvable",
    body: "La page que vous cherchez n'existe pas ou a peut-être été déplacée.",
    home: "Aller à l'accueil",
    champions: "Parcourir les champions",
    quiz: "Commencer le test",
  },
  errorPage: {
    heading: "Une erreur est survenue",
    body: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    retry: "Réessayer",
    home: "Aller à l'accueil",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const de: Dict = {
  siteName: "LoL-Charaktertyp-Test",
  unofficial: "Inoffiziell",
  version: "v0.1 MVP",
  home: {
    heading1: "Finde den League-of-Legends-",
    heading2: "Champion, der zu dir passt",
    lead: "Zwei Einstiege — Story und Gameplay — wählen per Vektor-Matching den passendsten Champion aus 172. 10 Fragen pro Einstieg.",
    pickedBadge: "Liebling",
    shikkari: "🎯 Voller Test",
    shikkariMeta: "20 Fragen · ~6 Min.",
    shikkariBody:
      "Mach beide Einstiege — Champions, die sich in den Top 3 überschneiden, werden hervorgehoben. Maximiert die Passung Persönlichkeit × Gameplay.",
    shikkariPick: "Wo möchtest du anfangen?",
    quick: "⚡ Schnelltest",
    quickMeta: "10 Fragen · ~3 Min.",
    quickBody: "Für wenn du nur eine Seite ausprobieren willst.",
    storyTitle: "Story",
    storyDesc: "10 Fragen zu Werten, Persönlichkeit und Beziehungen",
    gameTitle: "Gameplay",
    gameDesc: "10 Fragen zu Spielstil und bevorzugter Rolle",
    startHere: "Hier starten →",
    onlyStory: "🌍 Nur Story",
    onlyGame: "⚔️ Nur Gameplay",
    compareLink: "→ Vergleichsansicht (nach beiden)",
    championsLink: "→ Alle 172 Champions",
    faqHeading: "FAQ",
    faq: [
      {
        q: "Ist das ein offizieller Riot-Games-Test?",
        a: "Nein — es ist ein inoffizielles Fanprojekt. Die Champion-Porträts werden von Data Dragon bereitgestellt.",
      },
      {
        q: "Werden meine Ergebnisse irgendwo gespeichert?",
        a: "Nein. Deine Antworten werden nur im URL-Hash kodiert; auf einem Server wird nichts gespeichert. Öffne dieselbe URL und du bekommst immer dasselbe Ergebnis.",
      },
      {
        q: "Was ist der Unterschied zwischen dem Story- und dem Gameplay-Einstieg?",
        a: "Der Story-Einstieg gleicht nach Werten, Persönlichkeit und Beziehungen ab; der Gameplay-Einstieg nach Spielstil und bevorzugter Rolle. Mach beide und die sich überschneidenden Champions werden hervorgehoben.",
      },
      {
        q: "Wie viele Fragen gibt es?",
        a: "10 pro Einstieg, 20 insgesamt. Es dauert 3–6 Minuten.",
      },
      {
        q: "Kann ich es in anderen Sprachen nutzen?",
        a: "Ja — wechsle die Sprache im Header (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 Story-Einstieg",
    gameTitle: "⚔️ Gameplay-Einstieg",
    storyLead: "10 Fragen zu Werten, Persönlichkeit und Beziehungen. Vertrau deinem Bauchgefühl.",
    gameLead: "10 Fragen zu Spielstil und bevorzugter Rolle. Vertrau deinem Bauchgefühl.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← Zurück",
    next: "Weiter →",
    submit: "Ergebnis ansehen",
    missing: "Einige Fragen sind unbeantwortet. Geh zurück und beende sie.",
    keyboardHint: "Drücke 1–5 zum Antworten; nutze ← →, um zwischen Fragen zu wechseln.",
  },
  likert: ["Stimme gar nicht zu", "Stimme nicht zu", "Weder noch", "Stimme zu", "Stimme voll zu"],
  result: {
    typeStory: "Story-Einstieg — dein Ergebnis",
    typeGame: "Gameplay-Einstieg — dein Ergebnis",
    youAre: "Du bist",
    typeSuffix: "",
    bestMatch: "Am besten passender Champion",
    tweetCta: "Auf X teilen",
    championDetail: "Champion-Details",
    retake: "Wiederholen",
    profile8: "⚔️ Dein 8-Achsen-Profil",
    nextClose: (n: number) => `Als Nächstes am nächsten (${n})`,
    oppositeHeading: "⚠️ Dein komplettes Gegenteil",
    oppositeNote: (d: string) => `Ihr versteht euch vielleicht nicht (Distanz ${d})`,
    crossLead: "Setze den vollen Test fort (20 Fragen)",
    crossBody:
      "Mach auch den anderen Einstieg — du siehst deine Persönlichkeit und deinen Spielstil nebeneinander.",
    crossCta: (other: string) => `Den ${other}-Einstieg ausprobieren →`,
    bothDone: "Schon beide gemacht?",
    compareLink: "Vergleichsansicht",
    browseAll: "→ Alle Champions durchsehen",
    typeLabel: { story: "Story", game: "Gameplay" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `Ich bin Typ „${label}" → passte zu ${name} (Top 3: ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "Story × Gameplay",
    caption: "Einstiegsübergreifender Vergleich",
    perfect: "🎯 Perfekte Übereinstimmung",
    youAre: (name: string) => `Du verkörperst ${name}`,
    overlapNote: (ids: string) => `Champions in beiden Top 3: ${ids}`,
    noOverlap:
      "Kein Champion taucht in beiden Top 3 auf — gespaltene Persönlichkeit zwischen Story und Gameplay!",
    bothMissing: "Du hast noch keinen der beiden Tests gemacht.",
    stillNeedHeading: "Noch ein Schritt bis zum Vergleich",
    stillNeedBody: (label: string) =>
      `Der ${label}-Einstieg fehlt. Mach beide, um den Vergleich nebeneinander zu sehen.`,
    goCta: (label: string) => `Den ${label}-Einstieg machen →`,
    loading: "Lädt…",
  },
  champions: {
    heading: "Alle Champions",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "Nach Namen suchen (z. B. Garen, ヤスオ)",
    filterRole: "Rolle",
    filterRegion: "Region",
    filterArchetype: "Archetyp",
    all: "Alle",
    empty: "Kein Champion passt.",
    metaDescription:
      "Alle 172 League-of-Legends-Champions. Filtere nach Rolle, Region und Archetyp und sieh dir das 8-Achsen-Gameplay-Profil und die Story-Eigenschaften jedes Champions an.",
    detail: {
      back: "← Zurück zur Startseite",
      stats: "⚔️ 8 Gameplay-Achsen",
      story: "🌍 Story-Eigenschaften",
      similar: "Champions mit ähnlichem Spielstil",
      sameRegion: (region: string) => `Mehr Champions aus ${region}`,
      shareCta: "Diesen Typ teilen",
      shareText: (name: string) => `Ich bin Typ ${name} #LoLCharacterType`,
    },
  },
  metadata: {
    title: "LoL-Charaktertyp-Test",
    description:
      "Finde den League-of-Legends-Champion, der deiner Persönlichkeit und deinem Spielstil am nächsten kommt. Zwei Einstiegspunkte: Story (Weltbild) und Gameplay (Rolle/Archetyp).",
    ogDescription:
      "Finde deinen League-of-Legends-Charaktertyp. 10 Fragen × 2 Einstiege, per Vektor abgeglichen mit 172 Champions.",
  },
  legal: {
    disclaimerSuffix:
      " ist von Riot Games nicht autorisiert und gibt nicht die Ansichten oder Meinungen von Riot Games oder von Personen wieder, die offiziell an der Produktion oder Verwaltung von League of Legends beteiligt sind.",
    trademark: "League of Legends und Riot Games sind Marken von Riot Games, Inc.",
    ddragonPrefix: "Champion-Porträts bereitgestellt von ",
    ddragonMid: ". Diese Seite ist ein Fanprojekt im Einklang mit ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "Zum Inhalt springen",
  },
  notFound: {
    heading: "Seite nicht gefunden",
    body: "Die gesuchte Seite existiert nicht oder wurde möglicherweise verschoben.",
    home: "Zur Startseite",
    champions: "Champions durchsehen",
    quiz: "Test starten",
  },
  errorPage: {
    heading: "Etwas ist schiefgelaufen",
    body: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
    retry: "Erneut versuchen",
    home: "Zur Startseite",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const pt: Dict = {
  siteName: "Teste de tipo de personagem de LoL",
  unofficial: "Não oficial",
  version: "v0.1 MVP",
  home: {
    heading1: "Encontre o campeão de",
    heading2: "League of Legends que combina com você",
    lead: "Duas entradas — história e jogabilidade — escolhem o campeão mais próximo entre 172 por correspondência vetorial. 10 perguntas por entrada.",
    pickedBadge: "Favorito",
    shikkari: "🎯 Teste completo",
    shikkariMeta: "20 perguntas · ~6 min",
    shikkariBody:
      "Faça as duas entradas — os campeões que coincidem no top 3 ficam destacados. Maximiza o ajuste personalidade × jogabilidade.",
    shikkariPick: "Por onde você quer começar?",
    quick: "⚡ Teste rápido",
    quickMeta: "10 perguntas · ~3 min",
    quickBody: "Para quando você só quer testar um dos lados.",
    storyTitle: "História",
    storyDesc: "10 perguntas sobre valores, personalidade e relações",
    gameTitle: "Jogabilidade",
    gameDesc: "10 perguntas sobre estilo de jogo e função preferida",
    startHere: "Comece aqui →",
    onlyStory: "🌍 Só história",
    onlyGame: "⚔️ Só jogabilidade",
    compareLink: "→ Visão de comparação (após fazer as duas)",
    championsLink: "→ Todos os 172 campeões",
    faqHeading: "Perguntas frequentes",
    faq: [
      {
        q: "Este é um teste oficial da Riot Games?",
        a: "Não — é um projeto de fãs não oficial. Os retratos dos campeões são fornecidos pelo Data Dragon.",
      },
      {
        q: "Meus resultados são salvos em algum lugar?",
        a: "Não. Suas respostas são codificadas apenas no hash da URL; nada é armazenado em um servidor. Abra a mesma URL e você sempre terá o mesmo resultado.",
      },
      {
        q: "Qual é a diferença entre a entrada de história e a de jogabilidade?",
        a: "A entrada de história combina por valores, personalidade e relações; a de jogabilidade por estilo de jogo e função preferida. Faça as duas e os campeões que coincidem ficam destacados.",
      },
      {
        q: "Quantas perguntas tem?",
        a: "10 por entrada, 20 no total. Leva de 3 a 6 minutos.",
      },
      {
        q: "Posso usar em outros idiomas?",
        a: "Sim — troque o idioma no cabeçalho (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 Entrada de história",
    gameTitle: "⚔️ Entrada de jogabilidade",
    storyLead: "10 perguntas sobre valores, personalidade e relações. Confie no seu instinto.",
    gameLead: "10 perguntas sobre estilo de jogo e função preferida. Confie no seu instinto.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← Anterior",
    next: "Próxima →",
    submit: "Ver resultado",
    missing: "Há perguntas sem resposta. Volte e termine-as.",
    keyboardHint: "Pressione 1–5 para responder; use ← → para navegar entre as perguntas.",
  },
  likert: [
    "Discordo totalmente",
    "Discordo",
    "Nem concordo nem discordo",
    "Concordo",
    "Concordo totalmente",
  ],
  result: {
    typeStory: "Entrada de história — seu resultado",
    typeGame: "Entrada de jogabilidade — seu resultado",
    youAre: "Você é",
    typeSuffix: "",
    bestMatch: "Campeão mais compatível",
    tweetCta: "Compartilhar no X",
    championDetail: "Detalhes do campeão",
    retake: "Refazer",
    profile8: "⚔️ Seu perfil de 8 eixos",
    nextClose: (n: number) => `Os mais próximos a seguir (${n})`,
    oppositeHeading: "⚠️ Seu oposto absoluto",
    oppositeNote: (d: string) => `Vocês podem não se entender (distância ${d})`,
    crossLead: "Continue o teste completo (20 perguntas)",
    crossBody:
      "Faça também a outra entrada — você verá sua personalidade e seu estilo de jogo lado a lado.",
    crossCta: (other: string) => `Tentar a entrada de ${other} →`,
    bothDone: "Já fez as duas?",
    compareLink: "Visão de comparação",
    browseAll: "→ Ver todos os campeões",
    typeLabel: { story: "história", game: "jogabilidade" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `Sou do tipo "${label}" → caí no ${name} (top 3: ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "História × Jogabilidade",
    caption: "Comparação entre entradas",
    perfect: "🎯 Combinação perfeita",
    youAre: (name: string) => `Você encarna ${name}`,
    overlapNote: (ids: string) => `Campeões nos dois top 3: ${ids}`,
    noOverlap:
      "Nenhum campeão aparece nos dois top 3 — personalidade dividida entre história e jogabilidade!",
    bothMissing: "Você ainda não fez nenhum dos dois testes.",
    stillNeedHeading: "Falta um passo para comparar",
    stillNeedBody: (label: string) =>
      `Falta a entrada de ${label}. Faça as duas para ver a comparação lado a lado.`,
    goCta: (label: string) => `Fazer a entrada de ${label} →`,
    loading: "Carregando…",
  },
  champions: {
    heading: "Todos os campeões",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "Buscar por nome (ex.: Garen, ヤスオ)",
    filterRole: "Função",
    filterRegion: "Região",
    filterArchetype: "Arquétipo",
    all: "Todos",
    empty: "Nenhum campeão corresponde.",
    metaDescription:
      "Todos os 172 campeões de League of Legends. Filtre por função, região e arquétipo e veja o perfil de jogabilidade de 8 eixos e os traços de história de cada campeão.",
    detail: {
      back: "← Voltar ao início",
      stats: "⚔️ 8 eixos de jogabilidade",
      story: "🌍 Traços de história",
      similar: "Campeões com estilo de jogo parecido",
      sameRegion: (region: string) => `Mais campeões de ${region}`,
      shareCta: "Compartilhar este tipo",
      shareText: (name: string) => `Sou do tipo ${name} #LoLCharacterType`,
    },
  },
  metadata: {
    title: "Teste de tipo de personagem de LoL",
    description:
      "Descubra o campeão de League of Legends mais próximo da sua personalidade e do seu estilo de jogo. Dois pontos de entrada: história (visão de mundo) e jogabilidade (função/arquétipo).",
    ogDescription:
      "Descubra seu tipo de personagem de League of Legends. 10 perguntas × 2 entradas, comparadas por vetores com 172 campeões.",
  },
  legal: {
    disclaimerSuffix:
      " não é endossado pela Riot Games e não reflete as opiniões ou os pontos de vista da Riot Games nem de ninguém oficialmente envolvido na produção ou gestão de League of Legends.",
    trademark: "League of Legends e Riot Games são marcas registradas da Riot Games, Inc.",
    ddragonPrefix: "Retratos dos campeões fornecidos por ",
    ddragonMid: ". Este site é um projeto de fãs em conformidade com ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
  },
  notFound: {
    heading: "Página não encontrada",
    body: "A página que você procura não existe ou pode ter sido movida.",
    home: "Ir para o início",
    champions: "Ver campeões",
    quiz: "Começar o teste",
  },
  errorPage: {
    heading: "Algo deu errado",
    body: "Ocorreu um erro inesperado. Tente novamente.",
    retry: "Tentar de novo",
    home: "Ir para o início",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

const ru: Dict = {
  siteName: "Тест на тип персонажа LoL",
  unofficial: "Неофициальный",
  version: "v0.1 MVP",
  home: {
    heading1: "Найдите чемпиона League of Legends,",
    heading2: "который подходит именно вам",
    lead: "Два входа — история и геймплей — выбирают ближайшего чемпиона из 172 с помощью векторного сопоставления. 10 вопросов на каждый вход.",
    pickedBadge: "Любимчик",
    shikkari: "🎯 Полный тест",
    shikkariMeta: "20 вопросов · ~6 мин",
    shikkariBody:
      "Пройдите оба входа — чемпионы, совпавшие в топ-3, подсвечиваются. Максимизирует соответствие «личность × геймплей».",
    shikkariPick: "С чего хотите начать?",
    quick: "⚡ Быстрый тест",
    quickMeta: "10 вопросов · ~3 мин",
    quickBody: "Когда хочется попробовать только одну сторону.",
    storyTitle: "История",
    storyDesc: "10 вопросов о ценностях, характере и отношениях",
    gameTitle: "Геймплей",
    gameDesc: "10 вопросов о стиле игры и предпочитаемой роли",
    startHere: "Начать здесь →",
    onlyStory: "🌍 Только история",
    onlyGame: "⚔️ Только геймплей",
    compareLink: "→ Сравнение (после прохождения обоих)",
    championsLink: "→ Все 172 чемпиона",
    faqHeading: "Частые вопросы",
    faq: [
      {
        q: "Это официальный тест Riot Games?",
        a: "Нет — это неофициальный фанатский проект. Портреты чемпионов предоставляются Data Dragon.",
      },
      {
        q: "Сохраняются ли мои результаты где-нибудь?",
        a: "Нет. Ваши ответы кодируются только в хеше URL; на сервере ничего не хранится. Откройте тот же URL — и всегда получите тот же результат.",
      },
      {
        q: "В чём разница между входом «история» и входом «геймплей»?",
        a: "Вход «история» сопоставляет по ценностям, характеру и отношениям; вход «геймплей» — по стилю игры и предпочитаемой роли. Пройдите оба — совпавшие чемпионы подсветятся.",
      },
      {
        q: "Сколько вопросов?",
        a: "10 на каждый вход, 20 всего. Занимает 3–6 минут.",
      },
      {
        q: "Можно ли пользоваться на других языках?",
        a: "Да — переключите язык в шапке (日本語 / English / 한국어 / 中文 / Español / Français / Deutsch / Português / Русский).",
      },
    ],
  },
  quiz: {
    storyTitle: "🌍 Вход «история»",
    gameTitle: "⚔️ Вход «геймплей»",
    storyLead: "10 вопросов о ценностях, характере и отношениях. Доверьтесь интуиции.",
    gameLead: "10 вопросов о стиле игры и предпочитаемой роли. Доверьтесь интуиции.",
    progress: (i: number, n: number) => `Q${i} / ${n}`,
    prev: "← Назад",
    next: "Далее →",
    submit: "Посмотреть результат",
    missing: "Есть вопросы без ответа. Вернитесь и завершите их.",
    keyboardHint: "Нажимайте 1–5 для ответа; используйте ← →, чтобы перемещаться между вопросами.",
  },
  likert: [
    "Совершенно не согласен",
    "Не согласен",
    "Ни то ни другое",
    "Согласен",
    "Полностью согласен",
  ],
  result: {
    typeStory: "Вход «история» — ваш результат",
    typeGame: "Вход «геймплей» — ваш результат",
    youAre: "Вы —",
    typeSuffix: "",
    bestMatch: "Наиболее подходящий чемпион",
    tweetCta: "Поделиться в X",
    championDetail: "Подробности о чемпионе",
    retake: "Пройти заново",
    profile8: "⚔️ Ваш профиль по 8 осям",
    nextClose: (n: number) => `Следующие по близости (${n})`,
    oppositeHeading: "⚠️ Ваша полная противоположность",
    oppositeNote: (d: string) => `Возможно, вы не поймёте друг друга (расстояние ${d})`,
    crossLead: "Продолжите полный тест (20 вопросов)",
    crossBody: "Пройдите и другой вход — увидите свой характер и стиль игры бок о бок.",
    crossCta: (other: string) => `Пройти вход «${other}» →`,
    bothDone: "Уже прошли оба?",
    compareLink: "Сравнение",
    browseAll: "→ Просмотреть всех чемпионов",
    typeLabel: { story: "история", game: "геймплей" } as Record<"story" | "game", string>,
    shareText: (label: string, name: string, top3: string) =>
      `Я тип «${label}» → выпал ${name} (топ-3: ${top3}) #LoLCharacterType`,
  },
  compare: {
    heading: "История × Геймплей",
    caption: "Сравнение между входами",
    perfect: "🎯 Идеальное совпадение",
    youAre: (name: string) => `Вы воплощаете ${name}`,
    overlapNote: (ids: string) => `Чемпионы в обоих топ-3: ${ids}`,
    noOverlap:
      "Ни один чемпион не попал в оба топ-3 — раздвоение личности между историей и геймплеем!",
    bothMissing: "Вы ещё не прошли ни один из тестов.",
    stillNeedHeading: "Ещё один шаг до сравнения",
    stillNeedBody: (label: string) =>
      `Не хватает входа «${label}». Пройдите оба, чтобы увидеть сравнение бок о бок.`,
    goCta: (label: string) => `Пройти вход «${label}» →`,
    loading: "Загрузка…",
  },
  champions: {
    heading: "Все чемпионы",
    counter: (n: number, total: number) => `${n} / ${total}`,
    searchPlaceholder: "Поиск по имени (напр.: Гарен, Yasuo)",
    filterRole: "Роль",
    filterRegion: "Регион",
    filterArchetype: "Архетип",
    all: "Все",
    empty: "Ни один чемпион не подходит.",
    metaDescription:
      "Все 172 чемпиона League of Legends. Фильтруйте по роли, региону и архетипу и смотрите профиль геймплея по 8 осям и черты истории каждого чемпиона.",
    detail: {
      back: "← На главную",
      stats: "⚔️ 8 осей геймплея",
      story: "🌍 Черты истории",
      similar: "Чемпионы с похожим стилем игры",
      sameRegion: (region: string) => `Ещё чемпионы из региона ${region}`,
      shareCta: "Поделиться этим типом",
      shareText: (name: string) => `Я тип ${name} #LoLCharacterType`,
    },
  },
  metadata: {
    title: "Тест на тип персонажа LoL",
    description:
      "Найдите чемпиона League of Legends, наиболее близкого к вашему характеру и стилю игры. Два входа: история (мировоззрение) и геймплей (роль/архетип).",
    ogDescription:
      "Узнайте свой тип персонажа League of Legends. 10 вопросов × 2 входа, векторное сопоставление со 172 чемпионами.",
  },
  legal: {
    disclaimerSuffix:
      " не одобрен Riot Games и не отражает взгляды или мнения Riot Games либо кого-либо, официально причастного к производству или управлению League of Legends.",
    trademark: "League of Legends и Riot Games — товарные знаки Riot Games, Inc.",
    ddragonPrefix: "Портреты чемпионов предоставлены ",
    ddragonMid: ". Этот сайт — фанатский проект, соответствующий ",
    ddragonSuffix: ".",
  },
  a11y: {
    skipToContent: "Перейти к содержимому",
  },
  notFound: {
    heading: "Страница не найдена",
    body: "Страница, которую вы ищете, не существует или, возможно, была перемещена.",
    home: "На главную",
    champions: "К списку чемпионов",
    quiz: "Начать тест",
  },
  errorPage: {
    heading: "Что-то пошло не так",
    body: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз.",
    retry: "Попробовать снова",
    home: "На главную",
  },
  locale: {
    ja: "日本語",
    en: "English",
    ko: "한국어",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    ru: "Русский",
  } as Record<Locale, string>,
};

export const T: Record<Locale, Dict> = { ja, en, ko, zh, es, fr, de, pt, ru };

export const dict = (locale: Locale): Dict => T[locale];

// Convenience accessors for places that don't want to plumb the dict.
export const regionLabel = (locale: Locale, r: Region) => REGION_LABEL[locale][r];
export const archetypeLabel = (locale: Locale, a: Archetype) => ARCHETYPE_LABEL[locale][a];
export const roleLabel = (locale: Locale, r: Role) => ROLE_LABEL[locale][r];
export const storyDimLabel = (locale: Locale, d: StoryDim) => STORY_DIM_LABEL[locale][d];
export const gameDimAxis = (locale: Locale, d: GameDim) => GAME_DIM_AXIS[locale][d];

export const championName = (locale: Locale, c: Champion) =>
  locale === "ja" ? c.nameJa : (c.loc?.[locale]?.name ?? c.name);
export const championTitle = (locale: Locale, c: Champion) =>
  locale === "ja" ? c.titleJa : (c.loc?.[locale]?.title ?? c.title);

/** Lowercased searchable string across every locale's champion name + id. */
export const championSearchHaystack = (c: Champion): string => {
  const names = [c.id, c.name, c.nameJa];
  if (c.loc) {
    for (const v of Object.values(c.loc)) if (v?.name) names.push(v.name);
  }
  return names.join(" ").toLowerCase();
};

/**
 * Localized champion blurb. ja uses the hand-curated DDragon text; other
 * locales use the DDragon blurb for that locale (`c.loc[locale].blurb`), then
 * fall back to en, then to a synthesized tagline built from the structured
 * fields (region / archetypes / roles).
 */
export function championBlurb(locale: Locale, c: Champion): string {
  if (locale === "ja") return c.blurb;
  const localized = c.loc?.[locale]?.blurb?.trim();
  if (localized) return localized;
  const enBlurb = c.loc?.en?.blurb?.trim() ?? c.blurbEn?.trim();
  if (enBlurb) return enBlurb;
  // Synthesized fallback (very rare): structured tagline with localized terms.
  const archetypeBit = c.archetypes.map((a) => ARCHETYPE_LABEL[locale][a]).join(" / ");
  const region = REGION_LABEL[locale][c.region];
  const roles = c.roles.map((r) => ROLE_LABEL[locale][r]).join(" / ");
  const title = championTitle(locale, c);
  return `${c.name}, ${title}. From ${region}, plays as ${archetypeBit || "—"}${
    roles ? ` (${roles})` : ""
  }.`;
}
