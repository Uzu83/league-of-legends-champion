import type { Locale } from "./i18n";
import type { GameDim, StoryDim } from "./types";

export interface Persona {
  label: string;
  paragraphs: string[];
}

interface BiText {
  ja: string;
  en: string;
}

interface StoryTrait {
  test: (v: Record<StoryDim, number>) => number;
  label: BiText;
  paragraph: BiText;
}

const STORY_TRAITS: StoryTrait[] = [
  {
    test: (v) => Math.max(v.honor + v.organization + v.justice, 0),
    label: { ja: "規律の戦士", en: "Disciplined Warrior" },
    paragraph: {
      ja: "筋を通せる相手にしか心を開かない。組織や信念に身を捧げ、矛盾を許さない。",
      en: "You only trust people who hold the line. You commit to your order or your code, and you won't tolerate contradictions.",
    },
  },
  {
    test: (v) => Math.max(v.revenge + v.rival, 0),
    label: { ja: "報復者", en: "Avenger" },
    paragraph: {
      ja: "受けた仕打ちは決して忘れず、必ず借りを返す。好敵手の存在こそが自分を磨く。",
      en: "You never forget a slight, and you always pay it back. A worthy rival is the whetstone you sharpen yourself against.",
    },
  },
  {
    test: (v) => Math.max(v.protection + v.love + v.family, 0),
    label: { ja: "守護者", en: "Guardian" },
    paragraph: {
      ja: "大切な人や弱き者のためなら、自分の信念や正義すら曲げられる。守るために強くなる。",
      en: "For the people you love, you'll bend your own principles. You grow strong so others don't have to.",
    },
  },
  {
    test: (v) => Math.max(v.chaos + v.freedom, 0),
    label: { ja: "革命家", en: "Revolutionary" },
    paragraph: {
      ja: "安寧より変革。秩序ある退屈より、混沌の波に飛び込みたい衝動を抱えている。",
      en: "Change over comfort. You'd rather dive into chaos than sit through orderly boredom.",
    },
  },
  {
    test: (v) => Math.max(v.knowledge, 0) * 1.5,
    label: { ja: "求道者", en: "Seeker" },
    paragraph: {
      ja: "未知や禁忌に抗えず惹かれる。立入禁止の扉ほど開けたくなり、真理を求めて歩み続ける。",
      en: "The unknown and the forbidden pull you in. The more locked the door, the more you want what's behind it.",
    },
  },
  {
    test: (v) => Math.max(v.solitude + v.solo, 0),
    label: { ja: "孤高の漂流者", en: "Lone Drifter" },
    paragraph: {
      ja: "群れより孤独。光より闇。一人で考え一人で動くことを、自分の輪郭として大切にしている。",
      en: "Solitude over crowds, dusk over noon. Thinking alone and moving alone is how you keep your edges sharp.",
    },
  },
  {
    test: (v) => Math.max(v.ambition + v.solo, 0) * 0.9,
    label: { ja: "野心家", en: "Ambitious" },
    paragraph: {
      ja: "自分が誰より強くなれば、結局すべて解決する——そう信じて頂を目指す。",
      en: "If you climb high enough, every problem solves itself. That's why you don't stop climbing.",
    },
  },
  {
    test: (v) => Math.max(v.mentor, 0) * 1.4,
    label: { ja: "継承者", en: "Inheritor" },
    paragraph: {
      ja: "師や先達から授かった信念が、今も自分の支柱になっている。受け継いだ流派を体現する。",
      en: "The conviction your teacher passed on is still your spine. You carry the school forward.",
    },
  },
];

const NEUTRAL_STORY: Record<Locale, Persona> = {
  ja: {
    label: "中庸の探究者",
    paragraphs: [
      "極端には振らず、状況に応じて顔を変えるバランス型。多様な世界観に開かれている。",
    ],
  },
  en: {
    label: "Balanced Seeker",
    paragraphs: [
      "You don't lean to extremes — you shift with the situation. You stay open to many worldviews.",
    ],
  },
};

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
  pos: { label: BiText; sentence: BiText };
  neg: { label: BiText; sentence: BiText };
  threshold?: number;
}

const empty = (): { label: BiText; sentence: BiText } => ({
  label: { ja: "", en: "" },
  sentence: { ja: "", en: "" },
});

const GAME_BIPOLAR: Record<GameDim, GameTraitFromBipolar> = {
  range: {
    pos: {
      label: { ja: "遠距離型", en: "Ranged" },
      sentence: {
        ja: "射程の優位を活かし、間合いを保って一方的に削り続ける。",
        en: "You use your reach to keep distance and chip your enemies down without giving them a turn.",
      },
    },
    neg: {
      label: { ja: "近距離型", en: "Melee" },
      sentence: {
        ja: "肉薄の白兵戦こそが本領。間合いを詰めて殴り合う。",
        en: "Close-quarters brawls are where you shine — you close the gap and trade fists.",
      },
    },
    threshold: 0.45,
  },
  skillBased: {
    pos: {
      label: { ja: "スキル型", en: "Skill-based" },
      sentence: {
        ja: "アクティブスキルの組み立てとマナ管理でゲームを動かす。",
        en: "You drive the game with combo lines and tight resource management.",
      },
    },
    neg: {
      label: { ja: "AA型", en: "Auto-attacker" },
      sentence: {
        ja: "通常攻撃のリズムを軸に、立ち回りで火力を引き出す。",
        en: "You hum off auto-attack rhythm and pull damage out of positioning.",
      },
    },
    threshold: 0.5,
  },
  damageStyle: {
    pos: {
      label: { ja: "バースト型", en: "Burst" },
      sentence: {
        ja: "重要人物を一瞬で葬る、刹那の瞬発力で勝負する。",
        en: "Erasing the key target in a single beat — that's where you live.",
      },
    },
    neg: {
      label: { ja: "DPS型", en: "DPS" },
      sentence: {
        ja: "削り続けて押し切る、持続火力で長期戦を制する。",
        en: "You grind enemies down with sustained pressure and outlast them.",
      },
    },
    threshold: 0.45,
  },
  durability: {
    pos: {
      label: { ja: "堅牢タイプ", en: "Tanky" },
      sentence: {
        ja: "前線で耐え抜き、敵の攻撃を吸い込みながら戦う。",
        en: "You hold the front line, soaking up blows while you keep fighting.",
      },
    },
    neg: {
      label: { ja: "繊細タイプ", en: "Fragile" },
      sentence: {
        ja: "脆さと引き換えに高出力。被弾を避ける位置取りが鍵。",
        en: "You trade durability for raw output — staying off the radar is the whole game.",
      },
    },
    threshold: 0.5,
  },
  damage: {
    pos: {
      label: { ja: "高火力", en: "High-damage" },
      sentence: {
        ja: "純粋な打撃力でゲームをねじ伏せにかかる。",
        en: "You bend the game with raw damage.",
      },
    },
    neg: {
      label: { ja: "ユーティリティ重視", en: "Utility-focused" },
      sentence: {
        ja: "個人火力より、味方を活かす一手で勝ちを引き寄せる。",
        en: "You pull wins by enabling teammates rather than scoring kills yourself.",
      },
    },
    threshold: 0.5,
  },
  cc: {
    pos: {
      label: { ja: "制圧タイプ", en: "Lockdown" },
      sentence: {
        ja: "敵を縛り、止め、起点を作るCCで盤面を支配する。",
        en: "You bind, stun, and set up plays — your CC dictates the fight.",
      },
    },
    neg: empty(),
    threshold: 0.5,
  },
  mobility: {
    pos: {
      label: { ja: "高機動", en: "High mobility" },
      sentence: {
        ja: "踏み込んでは引く駆け引きで、相手を翻弄する。",
        en: "You dance in and out, never giving them a clean target.",
      },
    },
    neg: empty(),
    threshold: 0.5,
  },
  difficulty: {
    pos: {
      label: { ja: "高難度マニア", en: "High-skill" },
      sentence: {
        ja: "複雑な操作と仕掛けにこそ燃える、玄人志向。",
        en: "Mechanically demanding kits are the only ones that scratch the itch.",
      },
    },
    neg: {
      label: { ja: "気軽派", en: "Easy-going" },
      sentence: {
        ja: "細かい操作より、直感的に楽しめるピックを選びたい。",
        en: "You'd rather grab something intuitive and have fun than drill mechanics.",
      },
    },
    threshold: 0.55,
  },
  scaling: {
    pos: {
      label: { ja: "終盤型", en: "Late-game" },
      sentence: {
        ja: "じっくりスケールして終盤に爆発、長期戦こそが勝負どころ。",
        en: "You scale slow and break the game open in the late stages.",
      },
    },
    neg: {
      label: { ja: "序盤型", en: "Early-game" },
      sentence: {
        ja: "最初から強く、早期の主導権で押し切るタイプ。",
        en: "You're strong from the jump and you push the tempo early.",
      },
    },
    threshold: 0.5,
  },
};

const NEUTRAL_GAME: Record<Locale, Persona> = {
  ja: {
    label: "万能型",
    paragraphs: [
      "どの軸にも極端に偏らず、複数のスタイルを使い分けるオールラウンダー。",
    ],
  },
  en: {
    label: "All-rounder",
    paragraphs: [
      "You don't lean hard on any single axis — you flex between styles depending on what the team needs.",
    ],
  },
};

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
