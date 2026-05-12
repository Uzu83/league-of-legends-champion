import type { Locale } from "./i18n";
import { localizedText as L, LOCALES } from "./i18n";
import type { GameDim, StoryDim } from "./types";

export interface Persona {
  label: string;
  paragraphs: string[];
}

// Each `L(ja, en)` falls back to `en` for ko/zh/es/fr/de/pt/ru. The translation
// pass adds a 3rd arg, e.g. `L(ja, en, { ko: "…", zh: "…", … })`.
type LText = Record<Locale, string>;

interface StoryTrait {
  test: (v: Record<StoryDim, number>) => number;
  label: LText;
  paragraph: LText;
}

const STORY_TRAITS: StoryTrait[] = [
  {
    test: (v) => Math.max(v.honor + v.organization + v.justice, 0),
    label: L("規律の戦士", "Disciplined Warrior"),
    paragraph: L(
      "筋を通せる相手にしか心を開かない。組織や信念に身を捧げ、矛盾を許さない。",
      "You only trust people who hold the line. You commit to your order or your code, and you won't tolerate contradictions.",
    ),
  },
  {
    test: (v) => Math.max(v.revenge + v.rival, 0),
    label: L("報復者", "Avenger"),
    paragraph: L(
      "受けた仕打ちは決して忘れず、必ず借りを返す。好敵手の存在こそが自分を磨く。",
      "You never forget a slight, and you always pay it back. A worthy rival is the whetstone you sharpen yourself against.",
    ),
  },
  {
    test: (v) => Math.max(v.protection + v.love + v.family, 0),
    label: L("守護者", "Guardian"),
    paragraph: L(
      "大切な人や弱き者のためなら、自分の信念や正義すら曲げられる。守るために強くなる。",
      "For the people you love, you'll bend your own principles. You grow strong so others don't have to.",
    ),
  },
  {
    test: (v) => Math.max(v.chaos + v.freedom, 0),
    label: L("革命家", "Revolutionary"),
    paragraph: L(
      "安寧より変革。秩序ある退屈より、混沌の波に飛び込みたい衝動を抱えている。",
      "Change over comfort. You'd rather dive into chaos than sit through orderly boredom.",
    ),
  },
  {
    test: (v) => Math.max(v.knowledge, 0) * 1.5,
    label: L("求道者", "Seeker"),
    paragraph: L(
      "未知や禁忌に抗えず惹かれる。立入禁止の扉ほど開けたくなり、真理を求めて歩み続ける。",
      "The unknown and the forbidden pull you in. The more locked the door, the more you want what's behind it.",
    ),
  },
  {
    test: (v) => Math.max(v.solitude + v.solo, 0),
    label: L("孤高の漂流者", "Lone Drifter"),
    paragraph: L(
      "群れより孤独。光より闇。一人で考え一人で動くことを、自分の輪郭として大切にしている。",
      "Solitude over crowds, dusk over noon. Thinking alone and moving alone is how you keep your edges sharp.",
    ),
  },
  {
    test: (v) => Math.max(v.ambition + v.solo, 0) * 0.9,
    label: L("野心家", "Ambitious"),
    paragraph: L(
      "自分が誰より強くなれば、結局すべて解決する——そう信じて頂を目指す。",
      "If you climb high enough, every problem solves itself. That's why you don't stop climbing.",
    ),
  },
  {
    test: (v) => Math.max(v.mentor, 0) * 1.4,
    label: L("継承者", "Inheritor"),
    paragraph: L(
      "師や先達から授かった信念が、今も自分の支柱になっている。受け継いだ流派を体現する。",
      "The conviction your teacher passed on is still your spine. You carry the school forward.",
    ),
  },
];

const buildNeutral = (label: LText, paragraph: LText): Record<Locale, Persona> => {
  const out = {} as Record<Locale, Persona>;
  for (const l of LOCALES) out[l] = { label: label[l], paragraphs: [paragraph[l]] };
  return out;
};

const NEUTRAL_STORY = buildNeutral(
  L("中庸の探究者", "Balanced Seeker"),
  L(
    "極端には振らず、状況に応じて顔を変えるバランス型。多様な世界観に開かれている。",
    "You don't lean to extremes — you shift with the situation. You stay open to many worldviews.",
  ),
);

export function describeStory(vec: Record<StoryDim, number>, locale: Locale = "ja"): Persona {
  const scored = STORY_TRAITS.map((t) => ({ trait: t, score: t.test(vec) })).sort(
    (a, b) => b.score - a.score,
  );
  const primary = scored[0];
  const secondary = scored[1];
  if (!primary || primary.score < 0.4) return NEUTRAL_STORY[locale];
  const paragraphs = [primary.trait.paragraph[locale]];
  if (secondary && secondary.score > 0.5) paragraphs.push(secondary.trait.paragraph[locale]);
  return {
    label:
      secondary && secondary.score > 0.5
        ? `${primary.trait.label[locale]} × ${secondary.trait.label[locale]}`
        : primary.trait.label[locale],
    paragraphs,
  };
}

interface GameTraitFromBipolar {
  pos: { label: LText; sentence: LText };
  neg: { label: LText; sentence: LText };
  threshold?: number;
}

const emptySide = (): { label: LText; sentence: LText } => ({
  label: L("", ""),
  sentence: L("", ""),
});

const GAME_BIPOLAR: Record<GameDim, GameTraitFromBipolar> = {
  range: {
    pos: {
      label: L("遠距離型", "Ranged"),
      sentence: L(
        "射程の優位を活かし、間合いを保って一方的に削り続ける。",
        "You use your reach to keep distance and chip your enemies down without giving them a turn.",
      ),
    },
    neg: {
      label: L("近距離型", "Melee"),
      sentence: L(
        "肉薄の白兵戦こそが本領。間合いを詰めて殴り合う。",
        "Close-quarters brawls are where you shine — you close the gap and trade fists.",
      ),
    },
    threshold: 0.45,
  },
  skillBased: {
    pos: {
      label: L("スキル型", "Skill-based"),
      sentence: L(
        "アクティブスキルの組み立てとマナ管理でゲームを動かす。",
        "You drive the game with combo lines and tight resource management.",
      ),
    },
    neg: {
      label: L("AA型", "Auto-attacker"),
      sentence: L(
        "通常攻撃のリズムを軸に、立ち回りで火力を引き出す。",
        "You hum off auto-attack rhythm and pull damage out of positioning.",
      ),
    },
    threshold: 0.5,
  },
  damageStyle: {
    pos: {
      label: L("バースト型", "Burst"),
      sentence: L(
        "重要人物を一瞬で葬る、刹那の瞬発力で勝負する。",
        "Erasing the key target in a single beat — that's where you live.",
      ),
    },
    neg: {
      label: L("DPS型", "DPS"),
      sentence: L(
        "削り続けて押し切る、持続火力で長期戦を制する。",
        "You grind enemies down with sustained pressure and outlast them.",
      ),
    },
    threshold: 0.45,
  },
  durability: {
    pos: {
      label: L("堅牢タイプ", "Tanky"),
      sentence: L(
        "前線で耐え抜き、敵の攻撃を吸い込みながら戦う。",
        "You hold the front line, soaking up blows while you keep fighting.",
      ),
    },
    neg: {
      label: L("繊細タイプ", "Fragile"),
      sentence: L(
        "脆さと引き換えに高出力。被弾を避ける位置取りが鍵。",
        "You trade durability for raw output — staying off the radar is the whole game.",
      ),
    },
    threshold: 0.5,
  },
  damage: {
    pos: {
      label: L("高火力", "High-damage"),
      sentence: L("純粋な打撃力でゲームをねじ伏せにかかる。", "You bend the game with raw damage."),
    },
    neg: {
      label: L("ユーティリティ重視", "Utility-focused"),
      sentence: L(
        "個人火力より、味方を活かす一手で勝ちを引き寄せる。",
        "You pull wins by enabling teammates rather than scoring kills yourself.",
      ),
    },
    threshold: 0.5,
  },
  cc: {
    pos: {
      label: L("制圧タイプ", "Lockdown"),
      sentence: L(
        "敵を縛り、止め、起点を作るCCで盤面を支配する。",
        "You bind, stun, and set up plays — your CC dictates the fight.",
      ),
    },
    neg: emptySide(),
    threshold: 0.5,
  },
  mobility: {
    pos: {
      label: L("高機動", "High mobility"),
      sentence: L(
        "踏み込んでは引く駆け引きで、相手を翻弄する。",
        "You dance in and out, never giving them a clean target.",
      ),
    },
    neg: emptySide(),
    threshold: 0.5,
  },
  difficulty: {
    pos: {
      label: L("高難度マニア", "High-skill"),
      sentence: L(
        "複雑な操作と仕掛けにこそ燃える、玄人志向。",
        "Mechanically demanding kits are the only ones that scratch the itch.",
      ),
    },
    neg: {
      label: L("気軽派", "Easy-going"),
      sentence: L(
        "細かい操作より、直感的に楽しめるピックを選びたい。",
        "You'd rather grab something intuitive and have fun than drill mechanics.",
      ),
    },
    threshold: 0.55,
  },
  scaling: {
    pos: {
      label: L("終盤型", "Late-game"),
      sentence: L(
        "じっくりスケールして終盤に爆発、長期戦こそが勝負どころ。",
        "You scale slow and break the game open in the late stages.",
      ),
    },
    neg: {
      label: L("序盤型", "Early-game"),
      sentence: L(
        "最初から強く、早期の主導権で押し切るタイプ。",
        "You're strong from the jump and you push the tempo early.",
      ),
    },
    threshold: 0.5,
  },
};

const NEUTRAL_GAME = buildNeutral(
  L("万能型", "All-rounder"),
  L(
    "どの軸にも極端に偏らず、複数のスタイルを使い分けるオールラウンダー。",
    "You don't lean hard on any single axis — you flex between styles depending on what the team needs.",
  ),
);

export function describeGame(vec: Record<GameDim, number>, locale: Locale = "ja"): Persona {
  const labels: string[] = [];
  const sentences: string[] = [];
  for (const dim of Object.keys(GAME_BIPOLAR) as GameDim[]) {
    const t = GAME_BIPOLAR[dim];
    const v = vec[dim];
    const threshold = t.threshold ?? 0.5;
    if (v > threshold && t.pos.label[locale]) {
      labels.push(t.pos.label[locale]);
      sentences.push(t.pos.sentence[locale]);
    } else if (v < -threshold && t.neg.label[locale]) {
      labels.push(t.neg.label[locale]);
      sentences.push(t.neg.sentence[locale]);
    }
  }
  if (labels.length === 0) return NEUTRAL_GAME[locale];
  const top = labels.slice(0, 3);
  return {
    label: top.join(" × "),
    paragraphs: sentences.slice(0, 3),
  };
}
