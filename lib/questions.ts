import type { Locale } from "./i18n";
import { localizedText as L } from "./i18n";
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

// Each `L(ja, en)` falls back to `en` for ko/zh/es/fr/de/pt/ru. The translation
// pass adds a 3rd arg, e.g. `L(ja, en, { ko: "…", zh: "…", … })`.

export const STORY_QUESTIONS: StoryQuestion[] = [
  {
    id: "s1",
    text: L(
      "間違っていても、ブレない奴の方が好きだ",
      "I respect people who hold the line, even when they're wrong.",
      {
        ko: "틀렸더라도, 흔들리지 않는 사람이 더 좋다.",
        zh: "就算错了，我也更欣赏立场坚定不动摇的人。",
        es: "Respeto a quien se mantiene firme, aunque esté equivocado.",
        fr: "Je respecte ceux qui tiennent bon, même quand ils ont tort.",
        de: "Ich respektiere Menschen, die standhaft bleiben, selbst wenn sie im Unrecht sind.",
        pt: "Respeito quem se mantém firme, mesmo quando está errado.",
        ru: "Я уважаю тех, кто стоит на своём, даже когда не прав.",
      },
    ),
    weights: { honor: 0.7, organization: 0.6, justice: 0.3 },
  },
  {
    id: "s2",
    text: L("やられたら倍にして返す", "Hit me once and I hit back twice.", {
      ko: "당한 만큼, 아니 두 배로 되갚는다.",
      zh: "你打我一下，我就还你两下。",
      es: "Si me golpeas una vez, te devuelvo el doble.",
      fr: "Frappe-moi une fois, je rends le coup deux fois.",
      de: "Schlag mich einmal, und ich schlage doppelt zurück.",
      pt: "Me bata uma vez e eu devolvo em dobro.",
      ru: "Ударишь меня раз — отвечу вдвое.",
    }),
    weights: { revenge: 0.9, rival: 0.5 },
  },
  {
    id: "s3",
    text: L(
      "大切な人を守るためなら、嫌われ役になる覚悟がある",
      "I'll play the bad guy if it keeps the people I love safe.",
      {
        ko: "소중한 사람을 지킬 수 있다면, 기꺼이 악역을 맡겠다.",
        zh: "为了保护重要的人，我甘愿当那个被讨厌的人。",
        es: "Haré de malo si con eso mantengo a salvo a quienes quiero.",
        fr: "Je jouerai le méchant s'il le faut pour protéger ceux que j'aime.",
        de: "Ich spiele den Bösewicht, wenn das die Menschen schützt, die ich liebe.",
        pt: "Faço o papel de vilão se isso mantiver quem eu amo em segurança.",
        ru: "Я готов стать злодеем, если это убережёт дорогих мне людей.",
      },
    ),
    weights: { protection: 0.8, love: 0.6, family: 0.6 },
  },
  {
    id: "s4",
    text: L("安寧より革命", "I'd rather have revolution than peace.", {
      ko: "안정보다는 혁명.",
      zh: "比起安宁，我更想要革命。",
      es: "Prefiero la revolución a la paz.",
      fr: "Je préfère la révolution à la paix.",
      de: "Lieber Revolution als Ruhe.",
      pt: "Prefiro a revolução à paz.",
      ru: "Лучше революция, чем покой.",
    }),
    weights: { chaos: 0.8, freedom: 0.6, ambition: 0.4 },
  },
  {
    id: "s5",
    text: L(
      "立入禁止の扉ほど、開けたくなる",
      "The more forbidden the door, the more I want to open it.",
      {
        ko: "출입금지 표시가 붙은 문일수록 더 열어보고 싶다.",
        zh: "越是写着「禁止入内」的门，我越想打开。",
        es: "Cuanto más prohibida está una puerta, más quiero abrirla.",
        fr: "Plus une porte est interdite, plus j'ai envie de l'ouvrir.",
        de: "Je verbotener die Tür, desto mehr will ich sie öffnen.",
        pt: "Quanto mais proibida a porta, mais quero abri-la.",
        ru: "Чем больше дверь под запретом, тем сильнее хочется её открыть.",
      },
    ),
    weights: { knowledge: 0.8, chaos: 0.3 },
  },
  {
    id: "s6",
    text: L(
      "光より闇。バッドエンドの物語の方が美しい",
      "Darkness over light — bad endings move me more than happy ones.",
      {
        ko: "빛보다 어둠. 새드 엔딩이 해피 엔딩보다 더 아름답다.",
        zh: "比起光明我更爱黑暗——悲剧结局比圆满结局更动人。",
        es: "Oscuridad antes que luz: los finales tristes me conmueven más que los felices.",
        fr: "L'obscurité plutôt que la lumière — les fins tragiques me touchent plus que les fins heureuses.",
        de: "Dunkelheit statt Licht — traurige Enden berühren mich mehr als glückliche.",
        pt: "Trevas em vez de luz — finais tristes me tocam mais que os felizes.",
        ru: "Тьма милее света — печальные финалы трогают меня сильнее счастливых.",
      },
    ),
    weights: { chaos: 0.5, solitude: 0.6 },
  },
  {
    id: "s7",
    text: L("自分が頂点に立てば、世界の方が動く", "If I rise to the top, the world will follow.", {
      ko: "내가 정상에 서면, 세상이 알아서 따라온다.",
      zh: "只要我站上巅峰，世界自然会随我而动。",
      es: "Si llego a la cima, el mundo me seguirá.",
      fr: "Si j'atteins le sommet, le monde suivra.",
      de: "Wenn ich an die Spitze komme, folgt die Welt von selbst.",
      pt: "Se eu chegar ao topo, o mundo me segue.",
      ru: "Если я поднимусь на вершину, мир пойдёт за мной.",
    }),
    weights: { ambition: 0.8, solo: 0.6 },
  },
  {
    id: "s8",
    text: L("群れるより、独りで歩きたい", "I'd rather walk alone than run with the pack.", {
      ko: "무리에 섞이느니 혼자 걷는 편이 낫다.",
      zh: "比起随波逐流，我更想独自前行。",
      es: "Prefiero caminar solo que ir con la manada.",
      fr: "Je préfère marcher seul que suivre la meute.",
      de: "Lieber gehe ich allein, als mit der Meute zu laufen.",
      pt: "Prefiro caminhar sozinho a seguir a manada.",
      ru: "Лучше идти в одиночку, чем бежать со стаей.",
    }),
    weights: { solitude: 0.8, solo: 0.7, organization: -0.4 },
  },
  {
    id: "s9",
    text: L(
      "迷った時、頭に浮かぶ顔が一つある",
      "When I'm lost, one mentor's face always comes to mind.",
      {
        ko: "길을 잃었을 때, 늘 떠오르는 스승의 얼굴이 하나 있다.",
        zh: "迷茫的时候，脑海里总会浮现一位导师的面孔。",
        es: "Cuando me pierdo, siempre me viene a la mente el rostro de un mentor.",
        fr: "Quand je suis perdu, le visage d'un mentor me revient toujours.",
        de: "Wenn ich nicht weiterweiß, kommt mir immer das Gesicht eines Mentors in den Sinn.",
        pt: "Quando me perco, sempre me vem à mente o rosto de um mentor.",
        ru: "Когда я в растерянности, мне всегда вспоминается лицо одного наставника.",
      },
    ),
    weights: { mentor: 0.9 },
  },
  {
    id: "s10",
    text: L("ライバルがいると、自分も伸びる気がする", "Having a rival makes me sharper.", {
      ko: "라이벌이 있으면 나도 더 성장하는 것 같다.",
      zh: "有对手在，我才能变得更强。",
      es: "Tener un rival me hace mejor.",
      fr: "Avoir un rival m'aiguise.",
      de: "Ein Rivale macht mich schärfer.",
      pt: "Ter um rival me deixa mais afiado.",
      ru: "Соперник делает меня острее.",
    }),
    weights: { rival: 0.8, ambition: 0.3 },
  },
];

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: "g1",
    text: L(
      "じわじわ強くなるより、最初から派手に活躍したい",
      "I'd rather pop off early than scale up slowly.",
      {
        ko: "천천히 강해지기보다, 초반부터 화려하게 활약하고 싶다.",
        zh: "比起慢慢变强，我更想从一开始就大杀四方。",
        es: "Prefiero brillar pronto que escalar despacio.",
        fr: "Je préfère exploser tôt plutôt que monter en puissance lentement.",
        de: "Lieber früh durchstarten als langsam skalieren.",
        pt: "Prefiro brilhar cedo a escalar devagar.",
        ru: "Лучше ярко проявить себя в начале, чем медленно набирать силу.",
      },
    ),
    weights: { scaling: -0.7, damage: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g2",
    text: L(
      "正面突破より、予想外の動きで相手を出し抜きたい",
      "I'd rather outplay than overpower.",
      {
        ko: "정면 돌파보다, 의외의 움직임으로 상대를 따돌리고 싶다.",
        zh: "比起正面强攻，我更想用出其不意的操作甩开对手。",
        es: "Prefiero superar al rival con jugadas a aplastarlo con fuerza.",
        fr: "Je préfère prendre l'avantage par la finesse que par la force.",
        de: "Lieber überspielen als überwältigen.",
        pt: "Prefiro vencer com jogadas a vencer na força bruta.",
        ru: "Лучше переиграть, чем задавить силой.",
      },
    ),
    weights: { mobility: 0.7, difficulty: 0.3, damageStyle: 0.3 },
  },
  {
    id: "g3",
    text: L(
      "最後にすべてをひっくり返す方が好きだ",
      "I love flipping the whole game in the late stages.",
      {
        ko: "막판에 모든 걸 뒤집는 쪽이 좋다.",
        zh: "我喜欢在后期一举翻盘。",
        es: "Me encanta darle la vuelta a toda la partida en las fases finales.",
        fr: "J'adore renverser toute la partie en fin de jeu.",
        de: "Ich liebe es, in der späten Phase das ganze Spiel zu drehen.",
        pt: "Adoro virar a partida inteira nas fases finais.",
        ru: "Обожаю переворачивать всю игру на поздней стадии.",
      },
    ),
    weights: { scaling: 0.8, damage: 0.3, durability: 0.2 },
  },
  {
    id: "g4",
    text: L(
      "遠くから少しずつダメージを与えて、相手を追い詰めたい",
      "I prefer chipping enemies down from range until they break.",
      {
        ko: "멀리서 조금씩 깎아내며 상대를 몰아붙이고 싶다.",
        zh: "我喜欢从远处一点点磨血，把对手逼到崩溃。",
        es: "Prefiero desgastar a los enemigos desde lejos hasta que caigan.",
        fr: "Je préfère grignoter les ennemis à distance jusqu'à ce qu'ils craquent.",
        de: "Ich kratze Gegner lieber aus der Distanz herunter, bis sie zusammenbrechen.",
        pt: "Prefiro desgastar os inimigos à distância até eles caírem.",
        ru: "Предпочитаю издалека понемногу стачивать врагов, пока они не сломаются.",
      },
    ),
    weights: { range: 0.9, damageStyle: -0.6, damage: 0.4 },
  },
  {
    id: "g5",
    text: L(
      "自分は表に出ず、味方を支えて勝ちたい",
      "I'd rather enable my team than be the carry.",
      {
        ko: "내가 앞에 나서기보다, 아군을 받쳐주며 이기고 싶다.",
        zh: "我不想抢风头，更想辅佐队友取胜。",
        es: "Prefiero potenciar a mi equipo a ser el carry.",
        fr: "Je préfère mettre mon équipe en valeur plutôt qu'être le carry.",
        de: "Lieber bringe ich mein Team voran, als selbst der Carry zu sein.",
        pt: "Prefiro dar suporte ao time a ser o carregador.",
        ru: "Лучше помогать команде, чем быть кэрри.",
      },
    ),
    weights: { cc: 0.5, damage: -0.4, range: 0.4, skillBased: 0.5 },
  },
  {
    id: "g6",
    text: L(
      "敵のエース格を一瞬で倒す爽快感が欲しい",
      "Deleting the enemy carry in one combo is the dream.",
      {
        ko: "적의 에이스를 한순간에 끝장내는 쾌감을 원한다.",
        zh: "一套技能秒掉对面核心的爽快感，正是我想要的。",
        es: "Borrar al carry enemigo de un combo es el sueño.",
        fr: "Supprimer le carry adverse en un combo, c'est le rêve.",
        de: "Den gegnerischen Carry in einem Combo zu löschen — das ist der Traum.",
        pt: "Apagar o carregador inimigo num combo é o sonho.",
        ru: "Удалить вражеского кэрри одним комбо — вот мечта.",
      },
    ),
    weights: { damageStyle: 0.9, damage: 0.7, mobility: 0.5 },
  },
  {
    id: "g7",
    text: L(
      "真っ先に飛び込んで、戦いを始めるのは自分だ",
      "I'm the one who dives in first and starts the fight.",
      {
        ko: "가장 먼저 뛰어들어 싸움을 여는 건 나다.",
        zh: "第一个冲进去开团的，就是我。",
        es: "Soy el que se lanza primero y empieza la pelea.",
        fr: "C'est moi qui plonge en premier et lance le combat.",
        de: "Ich bin derjenige, der zuerst reinspringt und den Kampf eröffnet.",
        pt: "Sou eu que mergulho primeiro e começo a luta.",
        ru: "Это я первым врываюсь и начинаю бой.",
      },
    ),
    weights: { durability: 0.7, cc: 0.7, damage: -0.3, range: -0.4, scaling: -0.2 },
  },
  {
    id: "g8",
    text: L("複雑な操作にこそ燃える", "The more mechanically demanding, the better.", {
      ko: "복잡한 조작일수록 더 불타오른다.",
      zh: "操作越复杂，我越来劲。",
      es: "Cuanto más exigente sea la mecánica, mejor.",
      fr: "Plus c'est exigeant en mécanique, mieux c'est.",
      de: "Je anspruchsvoller die Mechanik, desto besser.",
      pt: "Quanto mais exigente a mecânica, melhor.",
      ru: "Чем сложнее механика, тем лучше.",
    }),
    weights: { difficulty: 0.9, skillBased: 0.5 },
  },
  {
    id: "g9",
    text: L(
      "攻めて引いてを繰り返すヒット&アウェイが好き",
      "I love the rhythm of poking in and dancing back out.",
      {
        ko: "치고 빠지기를 반복하는 히트 앤드 어웨이가 좋다.",
        zh: "我喜欢一进一退、不断骚扰的打了就跑节奏。",
        es: "Me encanta el ritmo de picar y retroceder.",
        fr: "J'adore le rythme du harcèlement puis du repli.",
        de: "Ich liebe den Rhythmus aus Anpoken und Zurücktanzen.",
        pt: "Adoro o ritmo de cutucar e recuar.",
        ru: "Обожаю ритм «ужалил — отскочил».",
      },
    ),
    weights: { mobility: 0.8, range: 0.3, damageStyle: 0.2 },
  },
  {
    id: "g10",
    text: L(
      "自分の決定的な一手で、戦況を一気にひっくり返したい",
      "I want one signature play to swing the whole teamfight.",
      {
        ko: "내 결정적인 한 수로 전황을 단번에 뒤집고 싶다.",
        zh: "我想用自己关键的一手，瞬间扭转整场团战。",
        es: "Quiero que una jugada decisiva mía cambie todo el combate.",
        fr: "Je veux qu'un coup d'éclat de ma part fasse basculer tout le combat d'équipe.",
        de: "Ich will mit einem entscheidenden Zug den ganzen Teamkampf kippen.",
        pt: "Quero que uma jogada decisiva minha vire toda a luta em equipe.",
        ru: "Хочу одним решающим ходом переломить весь командный бой.",
      },
    ),
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
