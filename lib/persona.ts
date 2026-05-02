import type { GameDim, StoryDim } from "./types";

export interface Persona {
  label: string;
  paragraphs: string[];
}

interface StoryTrait {
  test: (v: Record<StoryDim, number>) => number;
  label: string;
  paragraph: string;
}

const STORY_TRAITS: StoryTrait[] = [
  {
    test: (v) => Math.max(v.honor + v.organization + v.justice, 0),
    label: "規律の戦士",
    paragraph: "筋を通せる相手にしか心を開かない。組織や信念に身を捧げ、矛盾を許さない。",
  },
  {
    test: (v) => Math.max(v.revenge + v.rival, 0),
    label: "報復者",
    paragraph: "受けた仕打ちは決して忘れず、必ず借りを返す。好敵手の存在こそが自分を磨く。",
  },
  {
    test: (v) => Math.max(v.protection + v.love + v.family, 0),
    label: "守護者",
    paragraph: "大切な人や弱き者のためなら、自分の信念や正義すら曲げられる。守るために強くなる。",
  },
  {
    test: (v) => Math.max(v.chaos + v.freedom, 0),
    label: "革命家",
    paragraph: "安寧より変革。秩序ある退屈より、混沌の波に飛び込みたい衝動を抱えている。",
  },
  {
    test: (v) => Math.max(v.knowledge, 0) * 1.5,
    label: "求道者",
    paragraph: "未知や禁忌に抗えず惹かれる。立入禁止の扉ほど開けたくなり、真理を求めて歩み続ける。",
  },
  {
    test: (v) => Math.max(v.solitude + v.solo, 0),
    label: "孤高の漂流者",
    paragraph: "群れより孤独。光より闇。一人で考え一人で動くことを、自分の輪郭として大切にしている。",
  },
  {
    test: (v) => Math.max(v.ambition + v.solo, 0) * 0.9,
    label: "野心家",
    paragraph: "自分が誰より強くなれば、結局すべて解決する——そう信じて頂を目指す。",
  },
  {
    test: (v) => Math.max(v.mentor, 0) * 1.4,
    label: "継承者",
    paragraph: "師や先達から授かった信念が、今も自分の支柱になっている。受け継いだ流派を体現する。",
  },
];

export function describeStory(vec: Record<StoryDim, number>): Persona {
  const scored = STORY_TRAITS.map((t) => ({ trait: t, score: t.test(vec) })).sort(
    (a, b) => b.score - a.score,
  );
  const primary = scored[0];
  const secondary = scored[1];
  if (!primary || primary.score < 0.4) {
    return {
      label: "中庸の探究者",
      paragraphs: ["極端には振らず、状況に応じて顔を変えるバランス型。多様な世界観に開かれている。"],
    };
  }
  const paragraphs = [primary.trait.paragraph];
  if (secondary && secondary.score > 0.5) paragraphs.push(secondary.trait.paragraph);
  return {
    label:
      secondary && secondary.score > 0.5
        ? `${primary.trait.label} × ${secondary.trait.label}`
        : primary.trait.label,
    paragraphs,
  };
}

interface GameTraitFromBipolar {
  pos: { label: string; sentence: string };
  neg: { label: string; sentence: string };
  threshold?: number;
}

const GAME_BIPOLAR: Record<GameDim, GameTraitFromBipolar> = {
  range: {
    pos: {
      label: "遠距離型",
      sentence: "射程の優位を活かし、間合いを保って一方的に削り続ける。",
    },
    neg: {
      label: "近距離型",
      sentence: "肉薄の白兵戦こそが本領。間合いを詰めて殴り合う。",
    },
    threshold: 0.45,
  },
  skillBased: {
    pos: {
      label: "スキル型",
      sentence: "アクティブスキルの組み立てとマナ管理でゲームを動かす。",
    },
    neg: {
      label: "AA型",
      sentence: "通常攻撃のリズムを軸に、立ち回りで火力を引き出す。",
    },
    threshold: 0.5,
  },
  damageStyle: {
    pos: {
      label: "バースト型",
      sentence: "重要人物を一瞬で葬る、刹那の瞬発力で勝負する。",
    },
    neg: {
      label: "DPS型",
      sentence: "削り続けて押し切る、持続火力で長期戦を制する。",
    },
    threshold: 0.45,
  },
  durability: {
    pos: {
      label: "堅牢タイプ",
      sentence: "前線で耐え抜き、敵の攻撃を吸い込みながら戦う。",
    },
    neg: {
      label: "繊細タイプ",
      sentence: "脆さと引き換えに高出力。被弾を避ける位置取りが鍵。",
    },
    threshold: 0.5,
  },
  damage: {
    pos: {
      label: "高火力",
      sentence: "純粋な打撃力でゲームをねじ伏せにかかる。",
    },
    neg: {
      label: "ユーティリティ重視",
      sentence: "個人火力より、味方を活かす一手で勝ちを引き寄せる。",
    },
    threshold: 0.5,
  },
  cc: {
    pos: {
      label: "制圧タイプ",
      sentence: "敵を縛り、止め、起点を作るCCで盤面を支配する。",
    },
    neg: { label: "", sentence: "" },
    threshold: 0.5,
  },
  mobility: {
    pos: {
      label: "高機動",
      sentence: "踏み込んでは引く駆け引きで、相手を翻弄する。",
    },
    neg: { label: "", sentence: "" },
    threshold: 0.5,
  },
  difficulty: {
    pos: {
      label: "高難度マニア",
      sentence: "複雑な操作と仕掛けにこそ燃える、玄人志向。",
    },
    neg: {
      label: "気軽派",
      sentence: "細かい操作より、直感的に楽しめるピックを選びたい。",
    },
    threshold: 0.55,
  },
  scaling: {
    pos: {
      label: "終盤型",
      sentence: "じっくりスケールして終盤に爆発、長期戦こそが勝負どころ。",
    },
    neg: {
      label: "序盤型",
      sentence: "最初から強く、早期の主導権で押し切るタイプ。",
    },
    threshold: 0.5,
  },
};

export function describeGame(vec: Record<GameDim, number>): Persona {
  const labels: string[] = [];
  const sentences: string[] = [];
  for (const dim of Object.keys(GAME_BIPOLAR) as GameDim[]) {
    const t = GAME_BIPOLAR[dim];
    const v = vec[dim];
    const threshold = t.threshold ?? 0.5;
    if (v > threshold && t.pos.label) {
      labels.push(t.pos.label);
      sentences.push(t.pos.sentence);
    } else if (v < -threshold && t.neg.label) {
      labels.push(t.neg.label);
      sentences.push(t.neg.sentence);
    }
  }
  if (labels.length === 0) {
    return {
      label: "万能型",
      paragraphs: ["どの軸にも極端に偏らず、複数のスタイルを使い分けるオールラウンダー。"],
    };
  }
  const top = labels.slice(0, 3);
  return {
    label: top.join(" × "),
    paragraphs: sentences.slice(0, 3),
  };
}
