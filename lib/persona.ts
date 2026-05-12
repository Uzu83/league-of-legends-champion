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
    label: L("規律の戦士", "Disciplined Warrior", {
      ko: "규율의 전사",
      zh: "纪律战士",
      es: "Guerrero disciplinado",
      fr: "Guerrier discipliné",
      de: "Disziplinierter Krieger",
      pt: "Guerreiro disciplinado",
      ru: "Дисциплинированный воин",
    }),
    paragraph: L(
      "筋を通せる相手にしか心を開かない。組織や信念に身を捧げ、矛盾を許さない。",
      "You only trust people who hold the line. You commit to your order or your code, and you won't tolerate contradictions.",
      {
        ko: "원칙을 지키는 사람에게만 마음을 연다. 조직과 신념에 헌신하며 모순을 용납하지 않는다.",
        zh: "你只对讲原则的人敞开心扉。你忠于自己的组织或信条，绝不容忍自相矛盾。",
        es: "Solo confías en quien se mantiene firme. Te entregas a tu orden o a tu código y no toleras las contradicciones.",
        fr: "Tu n'accordes ta confiance qu'à ceux qui tiennent bon. Tu te dévoues à ton ordre ou à ton code, et tu ne tolères aucune contradiction.",
        de: "Du vertraust nur Menschen, die standhaft bleiben. Du gibst dich deinem Orden oder deinem Kodex hin und duldest keine Widersprüche.",
        pt: "Você só confia em quem se mantém firme. Entrega-se à sua ordem ou ao seu código e não tolera contradições.",
        ru: "Ты доверяешь лишь тем, кто держит слово. Ты предан своему ордену или кодексу и не терпишь противоречий.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.revenge + v.rival, 0),
    label: L("報復者", "Avenger", {
      ko: "복수자",
      zh: "复仇者",
      es: "Vengador",
      fr: "Vengeur",
      de: "Rächer",
      pt: "Vingador",
      ru: "Мститель",
    }),
    paragraph: L(
      "受けた仕打ちは決して忘れず、必ず借りを返す。好敵手の存在こそが自分を磨く。",
      "You never forget a slight, and you always pay it back. A worthy rival is the whetstone you sharpen yourself against.",
      {
        ko: "당한 일은 결코 잊지 않고 반드시 되갚는다. 호적수의 존재야말로 자신을 갈고닦게 한다.",
        zh: "你绝不忘记受过的伤害，必定加倍奉还。一个值得较量的对手，正是磨砺你的砺石。",
        es: "Nunca olvidas una afrenta y siempre la devuelves. Un rival digno es la piedra contra la que te afilas.",
        fr: "Tu n'oublies jamais un affront et tu le rends toujours. Un rival digne est la pierre sur laquelle tu t'aiguises.",
        de: "Du vergisst keine Kränkung und zahlst sie stets zurück. Ein würdiger Rivale ist der Schleifstein, an dem du dich schärfst.",
        pt: "Você nunca esquece uma ofensa e sempre a devolve. Um rival à altura é a pedra em que você se afia.",
        ru: "Ты не забываешь обид и всегда воздаёшь за них. Достойный соперник — точильный камень, о который ты оттачиваешь себя.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.protection + v.love + v.family, 0),
    label: L("守護者", "Guardian", {
      ko: "수호자",
      zh: "守护者",
      es: "Guardián",
      fr: "Gardien",
      de: "Beschützer",
      pt: "Guardião",
      ru: "Защитник",
    }),
    paragraph: L(
      "大切な人や弱き者のためなら、自分の信念や正義すら曲げられる。守るために強くなる。",
      "For the people you love, you'll bend your own principles. You grow strong so others don't have to.",
      {
        ko: "소중한 사람과 약한 이들을 위해서라면 자신의 신념이나 정의조차 굽힐 수 있다. 지키기 위해 강해진다.",
        zh: "为了所爱之人和弱者，你甚至能弯下自己的信念与正义。你变强，是为了让他人不必如此。",
        es: "Por las personas que amas, doblegas tus propios principios. Te haces fuerte para que otros no tengan que serlo.",
        fr: "Pour ceux que tu aimes, tu plies tes propres principes. Tu deviens fort pour que les autres n'aient pas à l'être.",
        de: "Für die Menschen, die du liebst, beugst du deine eigenen Prinzipien. Du wirst stark, damit andere es nicht sein müssen.",
        pt: "Pelas pessoas que ama, você dobra os próprios princípios. Fica forte para que os outros não precisem ser.",
        ru: "Ради дорогих тебе людей ты готов поступиться даже своими принципами. Ты становишься сильным, чтобы другим не пришлось.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.chaos + v.freedom, 0),
    label: L("革命家", "Revolutionary", {
      ko: "혁명가",
      zh: "革命者",
      es: "Revolucionario",
      fr: "Révolutionnaire",
      de: "Revolutionär",
      pt: "Revolucionário",
      ru: "Революционер",
    }),
    paragraph: L(
      "安寧より変革。秩序ある退屈より、混沌の波に飛び込みたい衝動を抱えている。",
      "Change over comfort. You'd rather dive into chaos than sit through orderly boredom.",
      {
        ko: "안정보다 변혁. 질서 잡힌 따분함보다 혼돈의 물결에 뛰어들고 싶은 충동을 품고 있다.",
        zh: "变革胜过安逸。比起循规蹈矩的无聊，你更愿纵身投入混沌的浪潮。",
        es: "Cambio antes que comodidad. Prefieres lanzarte al caos que soportar el aburrimiento del orden.",
        fr: "Le changement plutôt que le confort. Tu préfères plonger dans le chaos que subir l'ennui de l'ordre.",
        de: "Wandel statt Bequemlichkeit. Lieber stürzt du dich ins Chaos, als geordnete Langeweile auszusitzen.",
        pt: "Mudança em vez de conforto. Você prefere mergulhar no caos a aguentar o tédio da ordem.",
        ru: "Перемены вместо покоя. Ты скорее нырнёшь в хаос, чем будешь терпеть упорядоченную скуку.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.knowledge, 0) * 1.5,
    label: L("求道者", "Seeker", {
      ko: "구도자",
      zh: "求道者",
      es: "Buscador",
      fr: "Chercheur",
      de: "Suchender",
      pt: "Buscador",
      ru: "Искатель",
    }),
    paragraph: L(
      "未知や禁忌に抗えず惹かれる。立入禁止の扉ほど開けたくなり、真理を求めて歩み続ける。",
      "The unknown and the forbidden pull you in. The more locked the door, the more you want what's behind it.",
      {
        ko: "미지와 금기에 저항할 수 없이 끌린다. 잠긴 문일수록 그 너머가 궁금해지고, 진리를 찾아 계속 나아간다.",
        zh: "未知与禁忌对你有不可抗拒的吸引力。门锁得越紧，你越想知道门后藏着什么。",
        es: "Lo desconocido y lo prohibido te atraen sin remedio. Cuanto más cerrada está la puerta, más quieres lo que hay detrás.",
        fr: "L'inconnu et l'interdit t'attirent irrésistiblement. Plus la porte est verrouillée, plus tu veux savoir ce qu'il y a derrière.",
        de: "Das Unbekannte und das Verbotene ziehen dich unwiderstehlich an. Je fester die Tür verschlossen ist, desto mehr willst du wissen, was dahinter liegt.",
        pt: "O desconhecido e o proibido te atraem sem remédio. Quanto mais trancada a porta, mais você quer o que há atrás dela.",
        ru: "Неизвестное и запретное влекут тебя неудержимо. Чем крепче заперта дверь, тем сильнее ты хочешь узнать, что за ней.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.solitude + v.solo, 0),
    label: L("孤高の漂流者", "Lone Drifter", {
      ko: "고고한 방랑자",
      zh: "孤高的漂泊者",
      es: "Errante solitario",
      fr: "Vagabond solitaire",
      de: "Einsamer Wanderer",
      pt: "Errante solitário",
      ru: "Одинокий странник",
    }),
    paragraph: L(
      "群れより孤独。光より闇。一人で考え一人で動くことを、自分の輪郭として大切にしている。",
      "Solitude over crowds, dusk over noon. Thinking alone and moving alone is how you keep your edges sharp.",
      {
        ko: "무리보다 고독, 정오보다 황혼. 혼자 생각하고 혼자 움직이는 것을 자신의 윤곽으로 소중히 여긴다.",
        zh: "孤独胜过人群，黄昏胜过正午。独自思考、独自行动，是你保持自身轮廓的方式。",
        es: "Soledad antes que multitudes, crepúsculo antes que mediodía. Pensar y moverte a solas es como mantienes tus contornos afilados.",
        fr: "La solitude plutôt que la foule, le crépuscule plutôt que midi. Penser seul et agir seul, c'est ainsi que tu gardes tes contours nets.",
        de: "Einsamkeit statt Menschenmenge, Dämmerung statt Mittag. Allein zu denken und allein zu handeln, so bewahrst du deine klaren Konturen.",
        pt: "Solidão em vez de multidões, crepúsculo em vez de meio-dia. Pensar e agir sozinho é como você mantém seus contornos nítidos.",
        ru: "Одиночество милее толпы, сумерки — полудня. Думать в одиночку и действовать в одиночку — так ты сохраняешь чёткость своих очертаний.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.ambition + v.solo, 0) * 0.9,
    label: L("野心家", "Ambitious", {
      ko: "야심가",
      zh: "野心家",
      es: "Ambicioso",
      fr: "Ambitieux",
      de: "Ehrgeiziger",
      pt: "Ambicioso",
      ru: "Честолюбец",
    }),
    paragraph: L(
      "自分が誰より強くなれば、結局すべて解決する——そう信じて頂を目指す。",
      "If you climb high enough, every problem solves itself. That's why you don't stop climbing.",
      {
        ko: "내가 누구보다 강해지면 결국 모든 게 해결된다 — 그렇게 믿으며 정상을 향한다.",
        zh: "只要你爬得够高，所有问题都会迎刃而解。所以你从不停下攀登的脚步。",
        es: "Si subes lo bastante alto, todo problema se resuelve solo. Por eso no dejas de escalar.",
        fr: "Si tu grimpes assez haut, chaque problème se résout de lui-même. C'est pourquoi tu ne cesses jamais de grimper.",
        de: "Wenn du hoch genug steigst, löst sich jedes Problem von selbst. Darum hörst du nie auf zu steigen.",
        pt: "Se você subir alto o bastante, todo problema se resolve sozinho. Por isso você não para de subir.",
        ru: "Поднимешься достаточно высоко — и всё решится само собой. Поэтому ты не прекращаешь восхождение.",
      },
    ),
  },
  {
    test: (v) => Math.max(v.mentor, 0) * 1.4,
    label: L("継承者", "Inheritor", {
      ko: "계승자",
      zh: "传承者",
      es: "Heredero",
      fr: "Héritier",
      de: "Erbe",
      pt: "Herdeiro",
      ru: "Наследник",
    }),
    paragraph: L(
      "師や先達から授かった信念が、今も自分の支柱になっている。受け継いだ流派を体現する。",
      "The conviction your teacher passed on is still your spine. You carry the school forward.",
      {
        ko: "스승과 선배에게서 물려받은 신념이 지금도 자신의 기둥이 된다. 이어받은 유파를 몸으로 보여준다.",
        zh: "师长与前辈传下的信念，至今仍是你的脊梁。你将所承袭的流派发扬下去。",
        es: "La convicción que te transmitió tu maestro sigue siendo tu columna. Llevas la escuela hacia adelante.",
        fr: "La conviction que ton maître t'a transmise est encore ta colonne vertébrale. Tu fais perdurer l'école.",
        de: "Die Überzeugung, die dein Lehrer dir weitergab, ist noch immer dein Rückgrat. Du trägst die Schule weiter.",
        pt: "A convicção que seu mestre lhe passou ainda é a sua espinha. Você leva a escola adiante.",
        ru: "Убеждение, переданное наставником, по-прежнему твой стержень. Ты несёшь его школу дальше.",
      },
    ),
  },
];

const buildNeutral = (label: LText, paragraph: LText): Record<Locale, Persona> => {
  const out = {} as Record<Locale, Persona>;
  for (const l of LOCALES) out[l] = { label: label[l], paragraphs: [paragraph[l]] };
  return out;
};

const NEUTRAL_STORY = buildNeutral(
  L("中庸の探究者", "Balanced Seeker", {
    ko: "중용의 탐구자",
    zh: "中庸的探索者",
    es: "Buscador equilibrado",
    fr: "Chercheur d'équilibre",
    de: "Ausgewogener Suchender",
    pt: "Buscador equilibrado",
    ru: "Уравновешенный искатель",
  }),
  L(
    "極端には振らず、状況に応じて顔を変えるバランス型。多様な世界観に開かれている。",
    "You don't lean to extremes — you shift with the situation. You stay open to many worldviews.",
    {
      ko: "극단으로 치우치지 않고 상황에 따라 얼굴을 바꾸는 균형형. 다양한 세계관에 열려 있다.",
      zh: "你不走极端，会随情况调整自己的姿态。你对多元的世界观保持开放。",
      es: "No te vas a los extremos: te adaptas a la situación. Permaneces abierto a muchas visiones del mundo.",
      fr: "Tu ne penches pas vers les extrêmes : tu t'adaptes à la situation. Tu restes ouvert à de nombreuses visions du monde.",
      de: "Du neigst nicht zu Extremen — du passt dich der Situation an. Du bleibst vielen Weltbildern gegenüber offen.",
      pt: "Você não vai aos extremos — adapta-se à situação. Permanece aberto a muitas visões de mundo.",
      ru: "Ты не впадаешь в крайности — ты подстраиваешься под ситуацию. Ты открыт самым разным мировоззрениям.",
    },
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
      label: L("遠距離型", "Ranged", {
        ko: "원거리형",
        zh: "远程型",
        es: "A distancia",
        fr: "À distance",
        de: "Fernkampf-Typ",
        pt: "À distância",
        ru: "Дальник",
      }),
      sentence: L(
        "射程の優位を活かし、間合いを保って一方的に削り続ける。",
        "You use your reach to keep distance and chip your enemies down without giving them a turn.",
        {
          ko: "사거리의 우위를 살려 간격을 유지하며 일방적으로 깎아낸다.",
          zh: "你利用射程优势保持距离，单方面持续磨掉敌人的血量。",
          es: "Aprovechas tu alcance para mantener la distancia y desgastar a los enemigos sin darles turno.",
          fr: "Tu exploites ta portée pour garder tes distances et grignoter tes ennemis sans leur laisser de répit.",
          de: "Du nutzt deine Reichweite, um Abstand zu halten und Gegner herunterzukratzen, ohne ihnen einen Zug zu lassen.",
          pt: "Você usa o alcance para manter distância e desgastar os inimigos sem lhes dar chance.",
          ru: "Ты используешь дальность, чтобы держать дистанцию и безответно стачивать врагов.",
        },
      ),
    },
    neg: {
      label: L("近距離型", "Melee", {
        ko: "근거리형",
        zh: "近战型",
        es: "Cuerpo a cuerpo",
        fr: "Au corps à corps",
        de: "Nahkampf-Typ",
        pt: "Corpo a corpo",
        ru: "Ближник",
      }),
      sentence: L(
        "肉薄の白兵戦こそが本領。間合いを詰めて殴り合う。",
        "Close-quarters brawls are where you shine — you close the gap and trade fists.",
        {
          ko: "맞붙는 백병전이야말로 진가를 발휘하는 곳. 간격을 좁혀 주먹을 주고받는다.",
          zh: "近身肉搏才是你的本色——拉近距离，正面对拳。",
          es: "Las peleas cuerpo a cuerpo son donde brillas: acortas la distancia y cruzas golpes.",
          fr: "C'est dans la mêlée rapprochée que tu brilles — tu combles l'écart et échanges les coups.",
          de: "Im Nahkampfgetümmel läufst du zur Höchstform auf — du verkürzt die Distanz und schlägst zurück.",
          pt: "É no combate corpo a corpo que você brilha — fecha a distância e troca socos.",
          ru: "Ближний бой — твоя стихия: ты сокращаешь дистанцию и обмениваешься ударами.",
        },
      ),
    },
    threshold: 0.45,
  },
  skillBased: {
    pos: {
      label: L("スキル型", "Skill-based", {
        ko: "스킬형",
        zh: "技能型",
        es: "Basado en habilidades",
        fr: "Axé sur les compétences",
        de: "Fähigkeitsbasiert",
        pt: "Baseado em habilidades",
        ru: "Скилловик",
      }),
      sentence: L(
        "アクティブスキルの組み立てとマナ管理でゲームを動かす。",
        "You drive the game with combo lines and tight resource management.",
        {
          ko: "액티브 스킬 조합과 마나 관리로 게임을 움직인다.",
          zh: "你靠技能连招的组合与精打细算的资源管理来掌控比赛。",
          es: "Mueves la partida con combos de habilidades y una gestión ajustada de recursos.",
          fr: "Tu mènes la partie grâce à tes enchaînements de compétences et à une gestion serrée des ressources.",
          de: "Du treibst das Spiel mit Fähigkeiten-Combos und straffem Ressourcenmanagement voran.",
          pt: "Você conduz a partida com combos de habilidades e uma gestão apertada de recursos.",
          ru: "Ты ведёшь игру связками умений и чётким управлением ресурсами.",
        },
      ),
    },
    neg: {
      label: L("AA型", "Auto-attacker", {
        ko: "평타형",
        zh: "普攻型",
        es: "De ataque básico",
        fr: "Attaques de base",
        de: "Auto-Angreifer",
        pt: "De ataque básico",
        ru: "Автоатакер",
      }),
      sentence: L(
        "通常攻撃のリズムを軸に、立ち回りで火力を引き出す。",
        "You hum off auto-attack rhythm and pull damage out of positioning.",
        {
          ko: "평타 리듬을 축으로 삼고, 자리잡기로 화력을 끌어낸다.",
          zh: "你以普攻的节奏为核心，靠走位来打出输出。",
          es: "Te apoyas en el ritmo de los ataques básicos y sacas el daño del posicionamiento.",
          fr: "Tu te cales sur le rythme des attaques de base et tires tes dégâts de ton placement.",
          de: "Du lebst vom Rhythmus der Auto-Angriffe und holst deinen Schaden aus der Positionierung.",
          pt: "Você se apoia no ritmo dos ataques básicos e tira o dano do posicionamento.",
          ru: "Ты живёшь ритмом автоатак и выжимаешь урон из позиционирования.",
        },
      ),
    },
    threshold: 0.5,
  },
  damageStyle: {
    pos: {
      label: L("バースト型", "Burst", {
        ko: "버스트형",
        zh: "爆发型",
        es: "Burst",
        fr: "Burst",
        de: "Burst-Typ",
        pt: "Burst",
        ru: "Бёрст",
      }),
      sentence: L(
        "重要人物を一瞬で葬る、刹那の瞬発力で勝負する。",
        "Erasing the key target in a single beat — that's where you live.",
        {
          ko: "핵심 인물을 한순간에 끝장내는 찰나의 폭발력으로 승부한다.",
          zh: "一瞬间抹掉关键目标——那一刹那的爆发力，就是你的舞台。",
          es: "Borrar al objetivo clave en un solo instante: ahí es donde vives.",
          fr: "Effacer la cible clé en un seul temps — c'est là que tu vis.",
          de: "Das Schlüsselziel in einem einzigen Schlag auslöschen — da bist du zu Hause.",
          pt: "Apagar o alvo principal num único instante — é aí que você vive.",
          ru: "Стереть ключевую цель в одно мгновение — вот твоя стихия.",
        },
      ),
    },
    neg: {
      label: L("DPS型", "DPS", {
        ko: "DPS형",
        zh: "DPS型",
        es: "DPS",
        fr: "DPS",
        de: "DPS-Typ",
        pt: "DPS",
        ru: "ДПС",
      }),
      sentence: L(
        "削り続けて押し切る、持続火力で長期戦を制する。",
        "You grind enemies down with sustained pressure and outlast them.",
        {
          ko: "꾸준히 깎아내며 밀어붙이고, 지속 화력으로 장기전을 제압한다.",
          zh: "你持续磨耗、稳步压制，靠续航输出赢下持久战。",
          es: "Desgastas a los enemigos con presión sostenida y los superas en resistencia.",
          fr: "Tu uses tes ennemis sous une pression continue et tu tiens plus longtemps qu'eux.",
          de: "Du zermürbst Gegner mit anhaltendem Druck und hältst länger durch als sie.",
          pt: "Você desgasta os inimigos com pressão contínua e os supera em resistência.",
          ru: "Ты изматываешь врагов непрерывным давлением и переживаешь их.",
        },
      ),
    },
    threshold: 0.45,
  },
  durability: {
    pos: {
      label: L("堅牢タイプ", "Tanky", {
        ko: "탱키형",
        zh: "坦度型",
        es: "Resistente",
        fr: "Résistant",
        de: "Robuster Typ",
        pt: "Resistente",
        ru: "Танковый",
      }),
      sentence: L(
        "前線で耐え抜き、敵の攻撃を吸い込みながら戦う。",
        "You hold the front line, soaking up blows while you keep fighting.",
        {
          ko: "최전선에서 버텨내며 적의 공격을 빨아들이면서 싸운다.",
          zh: "你坚守前线，一边吸收敌人的攻击一边继续作战。",
          es: "Aguantas la primera línea, absorbiendo golpes mientras sigues luchando.",
          fr: "Tu tiens la ligne de front, encaissant les coups tout en continuant à te battre.",
          de: "Du hältst die Frontlinie und steckst Schläge ein, während du weiterkämpfst.",
          pt: "Você segura a linha de frente, absorvendo golpes enquanto continua lutando.",
          ru: "Ты держишь передовую, поглощая удары и продолжая бой.",
        },
      ),
    },
    neg: {
      label: L("繊細タイプ", "Fragile", {
        ko: "물몸형",
        zh: "脆皮型",
        es: "Frágil",
        fr: "Fragile",
        de: "Zerbrechlicher Typ",
        pt: "Frágil",
        ru: "Хрупкий",
      }),
      sentence: L(
        "脆さと引き換えに高出力。被弾を避ける位置取りが鍵。",
        "You trade durability for raw output — staying off the radar is the whole game.",
        {
          ko: "약한 몸을 대가로 높은 출력. 피격을 피하는 자리잡기가 핵심이다.",
          zh: "用脆弱换来高输出——不被打中、藏好身位，就是全部的关键。",
          es: "Cambias resistencia por daño puro: pasar desapercibido es todo el juego.",
          fr: "Tu échanges la résistance contre une puissance brute — rester hors de portée, c'est tout l'enjeu.",
          de: "Du tauschst Widerstandsfähigkeit gegen rohe Leistung — unter dem Radar zu bleiben, ist alles.",
          pt: "Você troca resistência por dano puro — passar despercebido é todo o jogo.",
          ru: "Ты меняешь живучесть на чистый урон — оставаться вне зоны поражения тут решает всё.",
        },
      ),
    },
    threshold: 0.5,
  },
  damage: {
    pos: {
      label: L("高火力", "High-damage", {
        ko: "고화력형",
        zh: "高伤害型",
        es: "Alto daño",
        fr: "Gros dégâts",
        de: "Hoher Schaden",
        pt: "Alto dano",
        ru: "Высокий урон",
      }),
      sentence: L(
        "純粋な打撃力でゲームをねじ伏せにかかる。",
        "You bend the game with raw damage.",
        {
          ko: "순수한 타격력으로 게임을 찍어 누른다.",
          zh: "你靠纯粹的伤害把比赛硬生生扭过来。",
          es: "Doblegas la partida a base de daño puro.",
          fr: "Tu plies la partie à coups de dégâts bruts.",
          de: "Du beugst das Spiel mit roher Schadenskraft.",
          pt: "Você dobra a partida na base do dano puro.",
          ru: "Ты ломаешь игру чистым уроном.",
        },
      ),
    },
    neg: {
      label: L("ユーティリティ重視", "Utility-focused", {
        ko: "유틸리티 중시형",
        zh: "功能型",
        es: "Centrado en utilidad",
        fr: "Axé sur l'utilité",
        de: "Auf Utility ausgerichtet",
        pt: "Focado em utilidade",
        ru: "Утилитарный",
      }),
      sentence: L(
        "個人火力より、味方を活かす一手で勝ちを引き寄せる。",
        "You pull wins by enabling teammates rather than scoring kills yourself.",
        {
          ko: "개인 화력보다 아군을 살리는 한 수로 승리를 끌어온다.",
          zh: "比起个人输出，你更靠那一手成全队友来拉来胜利。",
          es: "Arrastras victorias potenciando a tus compañeros, no consiguiendo asesinatos.",
          fr: "Tu décroches des victoires en mettant tes coéquipiers en valeur plutôt qu'en faisant les kills toi-même.",
          de: "Du holst Siege, indem du deine Mitspieler stark machst, statt selbst die Kills zu holen.",
          pt: "Você conquista vitórias dando força aos colegas, não conseguindo os abates você mesmo.",
          ru: "Ты приносишь победы, раскрывая союзников, а не набивая убийства сам.",
        },
      ),
    },
    threshold: 0.5,
  },
  cc: {
    pos: {
      label: L("制圧タイプ", "Lockdown", {
        ko: "제압형",
        zh: "控制型",
        es: "De control",
        fr: "De contrôle",
        de: "Lockdown-Typ",
        pt: "De controle",
        ru: "Контролёр",
      }),
      sentence: L(
        "敵を縛り、止め、起点を作るCCで盤面を支配する。",
        "You bind, stun, and set up plays — your CC dictates the fight.",
        {
          ko: "적을 묶고, 멈추고, 시작점을 만드는 CC로 판을 지배한다.",
          zh: "你用束缚、晕眩、制造切入点的控制技能主宰整个战场。",
          es: "Inmovilizas, aturdes y abres jugadas: tu CC dicta el combate.",
          fr: "Tu entraves, étourdis et amorces les actions — ton CC dicte le combat.",
          de: "Du fesselst, betäubst und leitest Plays ein — dein CC bestimmt den Kampf.",
          pt: "Você prende, atordoa e abre jogadas — seu CC dita a luta.",
          ru: "Ты сковываешь, оглушаешь и создаёшь зацепки — твой контроль диктует бой.",
        },
      ),
    },
    neg: emptySide(),
    threshold: 0.5,
  },
  mobility: {
    pos: {
      label: L("高機動", "High mobility", {
        ko: "고기동형",
        zh: "高机动型",
        es: "Alta movilidad",
        fr: "Haute mobilité",
        de: "Hohe Mobilität",
        pt: "Alta mobilidade",
        ru: "Высокая мобильность",
      }),
      sentence: L(
        "踏み込んでは引く駆け引きで、相手を翻弄する。",
        "You dance in and out, never giving them a clean target.",
        {
          ko: "치고 빠지는 수싸움으로 상대를 농락한다.",
          zh: "你一进一退、来去自如，从不给对手一个干净的目标。",
          es: "Entras y sales danzando, sin darles nunca un objetivo claro.",
          fr: "Tu entres et sors en dansant, sans jamais leur offrir une cible nette.",
          de: "Du tänzelst rein und raus und bietest ihnen nie ein klares Ziel.",
          pt: "Você entra e sai dançando, nunca lhes dando um alvo limpo.",
          ru: "Ты впархиваешь и ускользаешь, не давая им чистой цели.",
        },
      ),
    },
    neg: emptySide(),
    threshold: 0.5,
  },
  difficulty: {
    pos: {
      label: L("高難度マニア", "High-skill", {
        ko: "고난도 마니아",
        zh: "高难度玩家",
        es: "De alta destreza",
        fr: "Haut niveau technique",
        de: "Hoch anspruchsvoll",
        pt: "De alta destreza",
        ru: "Высокий скилл",
      }),
      sentence: L(
        "複雑な操作と仕掛けにこそ燃える、玄人志向。",
        "Mechanically demanding kits are the only ones that scratch the itch.",
        {
          ko: "복잡한 조작과 장치에야말로 불타오르는 고수 지향.",
          zh: "只有操作复杂、机制讲究的英雄才挠得到你的痒处，骨灰级玩家的取向。",
          es: "Solo los kits exigentes en lo mecánico te rascan la picazón: pura mentalidad de veterano.",
          fr: "Seuls les kits exigeants techniquement assouvissent ton envie — une mentalité de vétéran.",
          de: "Nur mechanisch anspruchsvolle Kits kratzen den Juckreiz — pure Kennermentalität.",
          pt: "Só os kits mecanicamente exigentes coçam essa vontade — pura mentalidade de veterano.",
          ru: "Только механически сложные чемпионы по-настоящему цепляют тебя — подход знатока.",
        },
      ),
    },
    neg: {
      label: L("気軽派", "Easy-going", {
        ko: "가벼운 파",
        zh: "轻松派",
        es: "Relajado",
        fr: "Décontracté",
        de: "Locker drauf",
        pt: "Tranquilo",
        ru: "Без напряга",
      }),
      sentence: L(
        "細かい操作より、直感的に楽しめるピックを選びたい。",
        "You'd rather grab something intuitive and have fun than drill mechanics.",
        {
          ko: "세세한 조작보다 직관적으로 즐길 수 있는 픽을 고르고 싶다.",
          zh: "比起钻研操作，你更想随手拿个直觉好上手的英雄痛快玩。",
          es: "Prefieres elegir algo intuitivo y pasarlo bien a machacar mecánicas.",
          fr: "Tu préfères prendre quelque chose d'intuitif et t'amuser plutôt que de bûcher la mécanique.",
          de: "Du greifst lieber zu etwas Intuitivem und hast Spaß, statt Mechaniken zu pauken.",
          pt: "Você prefere pegar algo intuitivo e se divertir a treinar mecânicas.",
          ru: "Ты скорее возьмёшь что-то интуитивное и повеселишься, чем будешь зубрить механику.",
        },
      ),
    },
    threshold: 0.55,
  },
  scaling: {
    pos: {
      label: L("終盤型", "Late-game", {
        ko: "후반형",
        zh: "后期型",
        es: "De fase final",
        fr: "De fin de partie",
        de: "Late-Game-Typ",
        pt: "De fase final",
        ru: "Поздняя игра",
      }),
      sentence: L(
        "じっくりスケールして終盤に爆発、長期戦こそが勝負どころ。",
        "You scale slow and break the game open in the late stages.",
        {
          ko: "차근차근 성장해 후반에 폭발, 장기전이야말로 승부처다.",
          zh: "你慢慢发育、后期爆发，持久战才是你定胜负的时刻。",
          es: "Escalas despacio y revientas la partida en las fases finales.",
          fr: "Tu montes en puissance lentement et fais exploser la partie en fin de jeu.",
          de: "Du skalierst langsam und brichst das Spiel in der späten Phase auf.",
          pt: "Você escala devagar e estoura a partida nas fases finais.",
          ru: "Ты медленно набираешь силу и взрываешь игру на поздней стадии.",
        },
      ),
    },
    neg: {
      label: L("序盤型", "Early-game", {
        ko: "초반형",
        zh: "前期型",
        es: "De fase inicial",
        fr: "De début de partie",
        de: "Early-Game-Typ",
        pt: "De fase inicial",
        ru: "Ранняя игра",
      }),
      sentence: L(
        "最初から強く、早期の主導権で押し切るタイプ。",
        "You're strong from the jump and you push the tempo early.",
        {
          ko: "처음부터 강하고, 초반 주도권으로 밀어붙이는 타입.",
          zh: "你从一开始就强势，靠前期主动权一路压制。",
          es: "Eres fuerte desde el principio y marcas el ritmo pronto.",
          fr: "Tu es fort dès le départ et tu imposes le tempo tôt.",
          de: "Du bist von Anfang an stark und gibst früh das Tempo vor.",
          pt: "Você é forte desde o início e dita o ritmo cedo.",
          ru: "Ты силён с самого старта и задаёшь темп с ранней стадии.",
        },
      ),
    },
    threshold: 0.5,
  },
};

const NEUTRAL_GAME = buildNeutral(
  L("万能型", "All-rounder", {
    ko: "만능형",
    zh: "全能型",
    es: "Todoterreno",
    fr: "Polyvalent",
    de: "Allrounder",
    pt: "Versátil",
    ru: "Универсал",
  }),
  L(
    "どの軸にも極端に偏らず、複数のスタイルを使い分けるオールラウンダー。",
    "You don't lean hard on any single axis — you flex between styles depending on what the team needs.",
    {
      ko: "어느 축에도 극단으로 치우치지 않고, 여러 스타일을 상황에 맞게 쓰는 올라운더.",
      zh: "你不在任何一个维度上偏得太极端，会根据队伍需要在多种风格之间灵活切换。",
      es: "No te inclinas con fuerza por ningún eje: alternas estilos según lo que necesite el equipo.",
      fr: "Tu ne penches fortement vers aucun axe — tu jongles entre les styles selon les besoins de l'équipe.",
      de: "Du lehnst dich auf keine einzelne Achse stark fest — du wechselst je nach Teambedarf zwischen den Stilen.",
      pt: "Você não pende forte para nenhum eixo — alterna entre estilos conforme o time precisa.",
      ru: "Ты не делаешь сильного крена ни в одну ось — переключаешься между стилями по нуждам команды.",
    },
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
