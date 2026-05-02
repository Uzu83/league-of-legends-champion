#!/usr/bin/env node
// Fetches DDragon JA champion data and merges with hand-crafted overrides
// to produce lib/champions.ts.
//
// Usage: node scripts/fetch-champions.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------- Region map (best-effort canonical LoL Universe) ----------
const REGION_MAP = {
  Aatrox: "ShadowIsles",
  Ahri: "Ionia",
  Akali: "Ionia",
  Akshan: "Shurima",
  Alistar: "Ixtal",
  Ambessa: "Noxus",
  Amumu: "Shurima",
  Anivia: "Freljord",
  Annie: "Noxus",
  Aphelios: "Targon",
  Ashe: "Freljord",
  AurelionSol: "Targon",
  Aurora: "Freljord",
  Azir: "Shurima",
  Bard: "Targon",
  Belveth: "Void",
  Blitzcrank: "Zaun",
  Brand: "Demacia",
  Braum: "Freljord",
  Briar: "ShadowIsles",
  Caitlyn: "Piltover",
  Camille: "Piltover",
  Cassiopeia: "Noxus",
  Chogath: "Void",
  Corki: "BandleCity",
  Darius: "Noxus",
  Diana: "Targon",
  Draaven: "Noxus",
  Draven: "Noxus",
  DrMundo: "Zaun",
  Ekko: "Zaun",
  Elise: "ShadowIsles",
  Evelynn: "ShadowIsles",
  Ezreal: "Piltover",
  Fiddlesticks: "Demacia",
  Fiora: "Demacia",
  Fizz: "Bilgewater",
  Galio: "Demacia",
  Gangplank: "Bilgewater",
  Garen: "Demacia",
  Gnar: "Freljord",
  Gragas: "Freljord",
  Graves: "Bilgewater",
  Gwen: "ShadowIsles",
  Hecarim: "ShadowIsles",
  Heimerdinger: "Piltover",
  Hwei: "Ionia",
  Illaoi: "Bilgewater",
  Irelia: "Ionia",
  Ivern: "Ixtal",
  Janna: "Zaun",
  JarvanIV: "Demacia",
  Jax: "Ionia",
  Jayce: "Piltover",
  Jhin: "Ionia",
  Jinx: "Zaun",
  KSante: "Shurima",
  Kaisa: "Void",
  Kalista: "ShadowIsles",
  Karma: "Ionia",
  Karthus: "ShadowIsles",
  Kassadin: "Void",
  Katarina: "Noxus",
  Kayle: "Demacia",
  Kayn: "Ionia",
  Kennen: "Ionia",
  Khazix: "Void",
  Kindred: "ShadowIsles",
  Kled: "Noxus",
  KogMaw: "Void",
  Leblanc: "Noxus",
  LeeSin: "Ionia",
  Leona: "Targon",
  Lillia: "Ionia",
  Lissandra: "Freljord",
  Lucian: "Demacia",
  Lulu: "BandleCity",
  Lux: "Demacia",
  Malphite: "Ixtal",
  Malzahar: "Void",
  Maokai: "ShadowIsles",
  MasterYi: "Ionia",
  Mel: "Noxus",
  Milio: "Ixtal",
  MissFortune: "Bilgewater",
  MonkeyKing: "Ionia",
  Mordekaiser: "Noxus",
  Morgana: "Demacia",
  Naafiri: "Shurima",
  Nami: "Ionia",
  Nasus: "Shurima",
  Nautilus: "Bilgewater",
  Neeko: "Ixtal",
  Nidalee: "Ixtal",
  Nilah: "Bilgewater",
  Nocturne: "ShadowIsles",
  Nunu: "Freljord",
  Olaf: "Freljord",
  Orianna: "Piltover",
  Ornn: "Freljord",
  Pantheon: "Targon",
  Poppy: "Demacia",
  Pyke: "Bilgewater",
  Qiyana: "Ixtal",
  Quinn: "Demacia",
  Rakan: "Ionia",
  Rammus: "Shurima",
  RekSai: "Void",
  Rell: "Noxus",
  Renata: "Zaun",
  Renekton: "Shurima",
  Rengar: "Ixtal",
  Riven: "Noxus",
  Rumble: "BandleCity",
  Ryze: "Ionia",
  Samira: "Noxus",
  Sejuani: "Freljord",
  Senna: "ShadowIsles",
  Seraphine: "Piltover",
  Sett: "Ionia",
  Shaco: "ShadowIsles",
  Shen: "Ionia",
  Shyvana: "Demacia",
  Singed: "Zaun",
  Sion: "Noxus",
  Sivir: "Shurima",
  Skarner: "Ixtal",
  Smolder: "BandleCity",
  Sona: "Demacia",
  Soraka: "Targon",
  Swain: "Noxus",
  Sylas: "Demacia",
  Syndra: "Ionia",
  TahmKench: "Bilgewater",
  Taliyah: "Shurima",
  Talon: "Noxus",
  Taric: "Targon",
  Teemo: "BandleCity",
  Thresh: "ShadowIsles",
  Tristana: "BandleCity",
  Trundle: "Freljord",
  Tryndamere: "Freljord",
  TwistedFate: "Bilgewater",
  Twitch: "Zaun",
  Udyr: "Freljord",
  Urgot: "Zaun",
  Varus: "Ionia",
  Vayne: "Demacia",
  Veigar: "BandleCity",
  Velkoz: "Void",
  Vex: "ShadowIsles",
  Vi: "Piltover",
  Viego: "ShadowIsles",
  Viktor: "Zaun",
  Vladimir: "Noxus",
  Volibear: "Freljord",
  Warwick: "Zaun",
  Xayah: "Ionia",
  Xerath: "Shurima",
  XinZhao: "Demacia",
  Yasuo: "Ionia",
  Yone: "Ionia",
  Yorick: "ShadowIsles",
  Yunara: "Ionia",
  Yuumi: "BandleCity",
  Zac: "Zaun",
  Zed: "Ionia",
  Zeri: "Zaun",
  Ziggs: "BandleCity",
  Zilean: "Ionia",
  Zoe: "Targon",
  Zyra: "Ixtal",
};

// ---------------- Roles (lane assignment) heuristic ----------------
const ROLE_OVERRIDES = {
  Aatrox: ["Top"],
  Ahri: ["Mid"],
  Akali: ["Mid", "Top"],
  Akshan: ["Mid", "ADC"],
  Alistar: ["Support"],
  Ambessa: ["Top"],
  Amumu: ["Jungle", "Support"],
  Anivia: ["Mid"],
  Annie: ["Mid", "Support"],
  Aphelios: ["ADC"],
  Ashe: ["ADC"],
  AurelionSol: ["Mid"],
  Aurora: ["Mid", "Top"],
  Azir: ["Mid"],
  Bard: ["Support"],
  Belveth: ["Jungle"],
  Blitzcrank: ["Support"],
  Brand: ["Mid", "Support"],
  Braum: ["Support"],
  Briar: ["Jungle"],
  Caitlyn: ["ADC"],
  Camille: ["Top"],
  Cassiopeia: ["Mid"],
  Chogath: ["Top"],
  Corki: ["Mid", "ADC"],
  Darius: ["Top"],
  Diana: ["Jungle", "Top"],
  Draven: ["ADC"],
  DrMundo: ["Top"],
  Ekko: ["Mid", "Jungle"],
  Elise: ["Jungle"],
  Evelynn: ["Jungle"],
  Ezreal: ["ADC"],
  Fiddlesticks: ["Jungle"],
  Fiora: ["Top"],
  Fizz: ["Mid"],
  Galio: ["Mid", "Support"],
  Gangplank: ["Top"],
  Garen: ["Top"],
  Gnar: ["Top"],
  Gragas: ["Jungle", "Top"],
  Graves: ["Jungle"],
  Gwen: ["Top"],
  Hecarim: ["Jungle"],
  Heimerdinger: ["Top", "Mid"],
  Hwei: ["Mid", "Support"],
  Illaoi: ["Top"],
  Irelia: ["Top", "Mid"],
  Ivern: ["Jungle"],
  Janna: ["Support"],
  JarvanIV: ["Jungle"],
  Jax: ["Top", "Jungle"],
  Jayce: ["Top", "Mid"],
  Jhin: ["ADC"],
  Jinx: ["ADC"],
  KSante: ["Top"],
  Kaisa: ["ADC"],
  Kalista: ["ADC"],
  Karma: ["Support"],
  Karthus: ["Jungle", "Mid"],
  Kassadin: ["Mid"],
  Katarina: ["Mid"],
  Kayle: ["Top", "Mid"],
  Kayn: ["Jungle"],
  Kennen: ["Top"],
  Khazix: ["Jungle"],
  Kindred: ["Jungle"],
  Kled: ["Top"],
  KogMaw: ["ADC"],
  Leblanc: ["Mid"],
  LeeSin: ["Jungle"],
  Leona: ["Support"],
  Lillia: ["Jungle"],
  Lissandra: ["Mid"],
  Lucian: ["ADC", "Mid"],
  Lulu: ["Support"],
  Lux: ["Mid", "Support"],
  Malphite: ["Top"],
  Malzahar: ["Mid"],
  Maokai: ["Support", "Top"],
  MasterYi: ["Jungle"],
  Mel: ["Mid"],
  Milio: ["Support"],
  MissFortune: ["ADC"],
  MonkeyKing: ["Jungle", "Top"],
  Mordekaiser: ["Top"],
  Morgana: ["Support", "Mid"],
  Naafiri: ["Mid", "Jungle"],
  Nami: ["Support"],
  Nasus: ["Top"],
  Nautilus: ["Support"],
  Neeko: ["Mid", "Support"],
  Nidalee: ["Jungle"],
  Nilah: ["ADC"],
  Nocturne: ["Jungle"],
  Nunu: ["Jungle"],
  Olaf: ["Jungle", "Top"],
  Orianna: ["Mid"],
  Ornn: ["Top"],
  Pantheon: ["Top", "Support"],
  Poppy: ["Top", "Support"],
  Pyke: ["Support"],
  Qiyana: ["Mid"],
  Quinn: ["Top"],
  Rakan: ["Support"],
  Rammus: ["Jungle"],
  RekSai: ["Jungle"],
  Rell: ["Support"],
  Renata: ["Support"],
  Renekton: ["Top"],
  Rengar: ["Jungle", "Top"],
  Riven: ["Top"],
  Rumble: ["Top"],
  Ryze: ["Mid", "Top"],
  Samira: ["ADC"],
  Sejuani: ["Jungle"],
  Senna: ["Support", "ADC"],
  Seraphine: ["Support", "Mid"],
  Sett: ["Top"],
  Shaco: ["Jungle"],
  Shen: ["Top"],
  Shyvana: ["Jungle"],
  Singed: ["Top"],
  Sion: ["Top"],
  Sivir: ["ADC"],
  Skarner: ["Jungle"],
  Smolder: ["ADC"],
  Sona: ["Support"],
  Soraka: ["Support"],
  Swain: ["Mid", "Support"],
  Sylas: ["Mid"],
  Syndra: ["Mid"],
  TahmKench: ["Top", "Support"],
  Taliyah: ["Mid", "Jungle"],
  Talon: ["Mid", "Jungle"],
  Taric: ["Support"],
  Teemo: ["Top"],
  Thresh: ["Support"],
  Tristana: ["ADC"],
  Trundle: ["Jungle", "Top"],
  Tryndamere: ["Top"],
  TwistedFate: ["Mid"],
  Twitch: ["ADC"],
  Udyr: ["Jungle"],
  Urgot: ["Top"],
  Varus: ["ADC"],
  Vayne: ["ADC", "Top"],
  Veigar: ["Mid"],
  Velkoz: ["Mid", "Support"],
  Vex: ["Mid"],
  Vi: ["Jungle"],
  Viego: ["Jungle"],
  Viktor: ["Mid"],
  Vladimir: ["Mid", "Top"],
  Volibear: ["Top", "Jungle"],
  Warwick: ["Jungle", "Top"],
  Xayah: ["ADC"],
  Xerath: ["Mid", "Support"],
  XinZhao: ["Jungle"],
  Yasuo: ["Mid", "Top"],
  Yone: ["Mid", "Top"],
  Yorick: ["Top"],
  Yunara: ["ADC"],
  Yuumi: ["Support"],
  Zac: ["Jungle"],
  Zed: ["Mid"],
  Zeri: ["ADC"],
  Ziggs: ["Mid", "ADC"],
  Zilean: ["Support", "Mid"],
  Zoe: ["Mid"],
  Zyra: ["Support"],
};

// ---------------- Hand-crafted overrides for the seed 30 ----------------
// Keys are DDragon ID. Values override anything auto-derived.
const HAND_CRAFTED = {
  Garen: {
    storyVec: { honor: 0.9, protection: 0.8, justice: 0.8, organization: 0.9, family: 0.6 },
    gameVec: { range: 0.0, skillBased: 0.4, damageStyle: 0.4, durability: 0.7, damage: 0.7, cc: 0.4, mobility: 0.4, difficulty: 0.1 },
    blurb: "規律と名誉に生きるデマーシアの剣。仲間のために旋風を放つ。",
  },
  Lux: {
    storyVec: { knowledge: 0.8, justice: 0.6, family: 0.7, organization: 0.6, freedom: 0.5 },
    gameVec: { range: 0.9, skillBased: 0.95, damageStyle: 0.7, durability: 0.2, damage: 0.7, cc: 0.7, mobility: 0.2, difficulty: 0.4 },
    blurb: "魔法を秘めた貴族の少女。光の力で仲間を導く。",
  },
  JarvanIV: {
    storyVec: { honor: 0.9, justice: 0.7, organization: 0.9, family: 0.8, protection: 0.6 },
    gameVec: { range: 0.1, skillBased: 0.7, damageStyle: 0.6, durability: 0.6, damage: 0.7, cc: 0.8, mobility: 0.6, difficulty: 0.5 },
    blurb: "デマーシア王子。先頭に立ち、王国の理念のために槍を振るう。",
  },
  Darius: {
    storyVec: { honor: 0.7, ambition: 0.6, family: 0.5, solo: 0.4, organization: 0.6 },
    gameVec: { range: 0.0, skillBased: 0.5, damageStyle: 0.4, durability: 0.7, damage: 0.85, cc: 0.4, mobility: 0.2, difficulty: 0.3 },
    blurb: "弱者を許さぬノクサスの軍人。実力こそが正義と信じる。",
  },
  Katarina: {
    storyVec: { revenge: 0.7, ambition: 0.7, family: 0.6, solo: 0.5 },
    gameVec: { range: 0.0, skillBased: 0.8, damageStyle: 0.85, durability: 0.2, damage: 0.85, cc: 0.0, mobility: 0.95, difficulty: 0.7 },
    blurb: "ノクサス貴族の暗殺者。父の遺志を継ぎ刃を振るう。",
  },
  Leblanc: {
    storyVec: { knowledge: 0.7, ambition: 0.9, chaos: 0.6, solo: 0.7 },
    gameVec: { range: 0.6, skillBased: 0.95, damageStyle: 0.9, durability: 0.2, damage: 0.85, cc: 0.4, mobility: 0.85, difficulty: 0.8 },
    blurb: "黒薔薇会の指導者。幻影を操り権力の影を支配する。",
  },
  Swain: {
    storyVec: { knowledge: 0.7, ambition: 0.9, organization: 0.8, solo: 0.4 },
    gameVec: { range: 0.7, skillBased: 0.9, damageStyle: 0.4, durability: 0.5, damage: 0.7, cc: 0.7, mobility: 0.2, difficulty: 0.5 },
    blurb: "ノクサス大将軍にして黒薔薇会の謀略家。秘密と引き換えに力を得る。",
  },
  Ahri: {
    storyVec: { knowledge: 0.6, love: 0.7, freedom: 0.7, solo: 0.7 },
    gameVec: { range: 0.7, skillBased: 0.9, damageStyle: 0.7, durability: 0.3, damage: 0.7, cc: 0.5, mobility: 0.85, difficulty: 0.5 },
    blurb: "魅了の魔力を操る九尾の狐。自分の正体を探し旅をする。",
  },
  Yasuo: {
    storyVec: { honor: 0.6, revenge: 0.5, freedom: 0.7, solo: 0.7, rival: 0.7 },
    gameVec: { range: 0.0, skillBased: 0.7, damageStyle: 0.6, durability: 0.4, damage: 0.75, cc: 0.3, mobility: 0.95, difficulty: 0.85 },
    blurb: "風を纏う流浪の剣士。汚名を晴らす旅を続ける。",
  },
  Zed: {
    storyVec: { knowledge: 0.7, ambition: 0.8, chaos: 0.5, mentor: 0.7, rival: 0.7 },
    gameVec: { range: 0.0, skillBased: 0.85, damageStyle: 0.9, durability: 0.3, damage: 0.85, cc: 0.1, mobility: 0.85, difficulty: 0.8 },
    blurb: "影の魔術を極めた暗殺結社の長。禁忌の力を躊躇なく使う。",
  },
  Akali: {
    storyVec: { justice: 0.7, protection: 0.6, solo: 0.7, mentor: 0.5 },
    gameVec: { range: 0.0, skillBased: 0.85, damageStyle: 0.85, durability: 0.3, damage: 0.85, cc: 0.1, mobility: 0.85, difficulty: 0.7 },
    blurb: "均衡から離れた一匹狼の暗殺者。自身の正義のために動く。",
  },
  MasterYi: {
    storyVec: { knowledge: 0.7, honor: 0.6, mentor: 0.9, solo: 0.5 },
    gameVec: { range: 0.0, skillBased: 0.2, damageStyle: 0.5, durability: 0.4, damage: 0.85, cc: 0.0, mobility: 0.6, difficulty: 0.2 },
    blurb: "無拘流剣術の最後の継承者。弟子に流派を伝える。",
  },
  Caitlyn: {
    storyVec: { justice: 0.9, protection: 0.7, organization: 0.8, family: 0.4 },
    gameVec: { range: 0.95, skillBased: 0.4, damageStyle: 0.5, durability: 0.2, damage: 0.7, cc: 0.4, mobility: 0.4, difficulty: 0.3 },
    blurb: "ピルトーヴァーの保安官。緻密な狙撃で犯罪者を追う。",
  },
  Vi: {
    storyVec: { justice: 0.7, protection: 0.7, family: 0.6, organization: 0.6 },
    gameVec: { range: 0.0, skillBased: 0.7, damageStyle: 0.6, durability: 0.6, damage: 0.7, cc: 0.85, mobility: 0.7, difficulty: 0.4 },
    blurb: "ヘックステック・ガントレットの拳で街を守る元無法者。",
  },
  Jinx: {
    storyVec: { chaos: 0.9, freedom: 0.7, family: 0.4, solo: 0.6, rival: 0.5 },
    gameVec: { range: 0.85, skillBased: 0.5, damageStyle: 0.7, durability: 0.2, damage: 0.85, cc: 0.4, mobility: 0.2, difficulty: 0.4 },
    blurb: "ゾウン出身の混沌そのもの。退屈ほど嫌いなものはない。",
  },
  Ekko: {
    storyVec: { knowledge: 0.7, protection: 0.7, family: 0.7, freedom: 0.5 },
    gameVec: { range: 0.4, skillBased: 0.85, damageStyle: 0.75, durability: 0.45, damage: 0.75, cc: 0.6, mobility: 0.85, difficulty: 0.7 },
    blurb: "時を巻き戻す装置を作った天才少年。仲間を守るために走る。",
  },
  Viktor: {
    storyVec: { knowledge: 0.9, ambition: 0.8, solo: 0.6 },
    gameVec: { range: 0.7, skillBased: 0.95, damageStyle: 0.6, durability: 0.3, damage: 0.7, cc: 0.5, mobility: 0.2, difficulty: 0.5 },
    blurb: "機械化こそ進化と信じる科学者。栄光の進化を成し遂げる。",
  },
  MissFortune: {
    storyVec: { revenge: 0.8, freedom: 0.6, solo: 0.6, ambition: 0.5 },
    gameVec: { range: 0.7, skillBased: 0.55, damageStyle: 0.7, durability: 0.2, damage: 0.85, cc: 0.3, mobility: 0.3, difficulty: 0.2 },
    blurb: "母を殺した海賊王に復讐を果たした賞金稼ぎ。",
  },
  Gangplank: {
    storyVec: { ambition: 0.7, chaos: 0.6, solo: 0.6, rival: 0.5 },
    gameVec: { range: 0.4, skillBased: 0.7, damageStyle: 0.5, durability: 0.4, damage: 0.8, cc: 0.4, mobility: 0.4, difficulty: 0.85 },
    blurb: "ビルジウォーターの元支配者。全てを失っても海を諦めない。",
  },
  Pyke: {
    storyVec: { revenge: 0.9, chaos: 0.5, solo: 0.8 },
    gameVec: { range: 0.0, skillBased: 0.85, damageStyle: 0.85, durability: 0.3, damage: 0.75, cc: 0.7, mobility: 0.85, difficulty: 0.6 },
    blurb: "海の底から戻ってきた裏切られた銛打ち。裏切り者リストを消していく。",
  },
  Diana: {
    storyVec: { knowledge: 0.7, solitude: 0.7, solo: 0.6, revenge: 0.4 },
    gameVec: { range: 0.0, skillBased: 0.85, damageStyle: 0.7, durability: 0.5, damage: 0.75, cc: 0.5, mobility: 0.7, difficulty: 0.4 },
    blurb: "月の戦士。太陽信仰の社会から追放された孤高の存在。",
  },
  Leona: {
    storyVec: { honor: 0.8, protection: 0.9, justice: 0.7, organization: 0.7, rival: 0.5 },
    gameVec: { range: 0.0, skillBased: 0.85, damageStyle: 0.4, durability: 0.85, damage: 0.4, cc: 0.95, mobility: 0.4, difficulty: 0.2 },
    blurb: "太陽の戦士。仲間を守る盾として光を放つ。",
  },
  Pantheon: {
    storyVec: { honor: 0.9, justice: 0.7, protection: 0.6, solo: 0.5 },
    gameVec: { range: 0.0, skillBased: 0.7, damageStyle: 0.7, durability: 0.5, damage: 0.75, cc: 0.5, mobility: 0.5, difficulty: 0.4 },
    blurb: "戦争の神格を宿した不屈の戦士。何度倒れても立ち上がる。",
  },
  Azir: {
    storyVec: { honor: 0.7, ambition: 0.8, organization: 0.8, family: 0.4 },
    gameVec: { range: 0.7, skillBased: 0.9, damageStyle: 0.5, durability: 0.3, damage: 0.7, cc: 0.7, mobility: 0.6, difficulty: 0.95 },
    blurb: "砂に眠る帝国を蘇らせるシュリーマの皇帝。",
  },
  Nasus: {
    storyVec: { knowledge: 0.9, justice: 0.7, family: 0.7, protection: 0.6 },
    gameVec: { range: 0.0, skillBased: 0.5, damageStyle: 0.4, durability: 0.75, damage: 0.8, cc: 0.5, mobility: 0.2, difficulty: 0.3 },
    blurb: "シュリーマの神格にして歴史の守人。弟との因縁を背負う。",
  },
  Ashe: {
    storyVec: { love: 0.6, protection: 0.7, family: 0.7, organization: 0.7, honor: 0.6 },
    gameVec: { range: 0.85, skillBased: 0.5, damageStyle: 0.6, durability: 0.2, damage: 0.7, cc: 0.85, mobility: 0.2, difficulty: 0.3 },
    blurb: "氷弓で部族を率いる女王。フレヨルド統一を夢見る。",
  },
  Tryndamere: {
    storyVec: { revenge: 0.8, family: 0.7, rival: 0.5, solo: 0.4 },
    gameVec: { range: 0.0, skillBased: 0.3, damageStyle: 0.5, durability: 0.6, damage: 0.85, cc: 0.3, mobility: 0.5, difficulty: 0.4 },
    blurb: "怒りで自らを蘇らせる蛮族の王。アッシュの伴侶。",
  },
  Thresh: {
    storyVec: { chaos: 0.7, ambition: 0.5, solo: 0.7 },
    gameVec: { range: 0.4, skillBased: 0.9, damageStyle: 0.3, durability: 0.5, damage: 0.4, cc: 0.95, mobility: 0.5, difficulty: 0.7 },
    blurb: "霊魂を集める残忍な獄吏。被害者の苦悶を糧とする。",
  },
  Khazix: {
    storyVec: { solitude: 0.8, chaos: 0.6, solo: 0.9, rival: 0.7 },
    gameVec: { range: 0.0, skillBased: 0.7, damageStyle: 0.85, durability: 0.4, damage: 0.85, cc: 0.3, mobility: 0.8, difficulty: 0.5 },
    blurb: "適応し進化し続けるヴォイドの捕食者。最強の獲物を求める。",
  },
  Teemo: {
    storyVec: { honor: 0.6, protection: 0.5, organization: 0.6, freedom: 0.5 },
    gameVec: { range: 0.4, skillBased: 0.5, damageStyle: 0.4, durability: 0.3, damage: 0.7, cc: 0.3, mobility: 0.55, difficulty: 0.3 },
    blurb: "バンドル偵察軍の小さな英雄。猛毒のダーツで森を守る。",
  },
};

// ---------------- Auto-derive helpers ----------------
function autoArchetypes(tags) {
  // Tags from DDragon already match our enum mostly. "Support" tag used.
  const valid = new Set(["Assassin", "Mage", "Marksman", "Tank", "Fighter", "Support", "Specialist"]);
  const out = tags.filter((t) => valid.has(t));
  // Heuristic: bruiser = Fighter+Tank
  if (tags.includes("Fighter") && tags.includes("Tank")) {
    if (!out.includes("Bruiser")) out.push("Bruiser");
  }
  return out.length > 0 ? out : ["Fighter"];
}

function autoGameVec(info, tags) {
  const isMage = tags.includes("Mage");
  const isAssassin = tags.includes("Assassin");
  const isMarksman = tags.includes("Marksman");
  const isTank = tags.includes("Tank");
  const isSupport = tags.includes("Support");
  const isFighter = tags.includes("Fighter");
  const isSpecialist = tags.includes("Specialist");

  const range = isMarksman || isMage ? 0.75 : isSupport ? 0.55 : isAssassin ? 0.2 : isFighter ? 0.15 : 0.4;
  const skillBased = isMage || isSupport ? 0.8 : isAssassin ? 0.7 : isMarksman ? 0.4 : isFighter ? 0.5 : 0.5;
  const damageStyle = isAssassin ? 0.85 : isMage ? 0.7 : isMarksman ? 0.45 : isTank ? 0.35 : isSupport ? 0.4 : 0.55;
  const durability = Math.max(0.05, Math.min(0.95, info.defense / 10));
  const damage = Math.max(0.05, Math.min(0.95, info.attack / 10 * 0.6 + info.magic / 10 * 0.6));
  const cc = isTank || isSupport ? 0.7 : isMage ? 0.55 : isFighter ? 0.4 : isAssassin ? 0.2 : 0.4;
  const mobility = isAssassin ? 0.8 : isFighter ? 0.55 : isMarksman ? 0.45 : isMage ? 0.35 : isTank ? 0.35 : 0.5;
  const difficulty = Math.max(0.05, Math.min(0.95, info.difficulty / 10));
  const specialistBoost = isSpecialist ? 0.1 : 0;
  return {
    range,
    skillBased: Math.min(0.95, skillBased + specialistBoost),
    damageStyle,
    durability,
    damage,
    cc,
    mobility,
    difficulty: Math.min(0.95, difficulty + specialistBoost),
  };
}

function slugify(id) {
  // DDragon ID like "MasterYi" → slug "masteryi"
  return id.toLowerCase();
}

function shortBlurb(blurb) {
  // Take 1st sentence (Japanese full-stop)
  const m = blurb.match(/^[^。]{5,90}。/);
  return (m ? m[0] : blurb.slice(0, 80)).replace(/\s+/g, "");
}

// ---------------- Main ----------------
const VERSION = "16.9.1";
const URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/ja_JP/champion.json`;

console.error(`Fetching ${URL}...`);
const res = await fetch(URL);
if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
const data = await res.json();
const entries = Object.entries(data.data);
console.error(`Got ${entries.length} champions`);

const champions = entries
  .map(([key, c]) => {
    const ddragonId = c.id;
    const id = slugify(ddragonId);
    const region = REGION_MAP[ddragonId] ?? "Demacia"; // fallback
    const roles = ROLE_OVERRIDES[ddragonId] ?? ["Mid"];
    const archetypes = autoArchetypes(c.tags);
    const auto = autoGameVec(c.info, c.tags);
    const hand = HAND_CRAFTED[ddragonId];
    const gameVec = hand?.gameVec ?? auto;
    const storyVec = hand?.storyVec ?? {};
    const blurb = hand?.blurb ?? shortBlurb(c.blurb);
    return {
      id,
      name: c.id, // English-ish key (DDragon doesn't expose en name in ja file; ok)
      nameJa: c.name,
      title: c.id, // placeholder — DDragon ja file has only ja titles
      titleJa: c.title,
      region,
      ddragonId,
      roles,
      archetypes,
      storyVec,
      gameVec,
      blurb,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

// ---------------- Emit TS file ----------------
const fmt = (v) => JSON.stringify(v, null, 2).replace(/"([a-zA-Z][a-zA-Z0-9]*)":/g, "$1:");

const out = `import { type Champion, GAME_DIMS, type GameDim, STORY_DIMS, type StoryDim } from "./types";

const s = (p: Partial<Record<StoryDim, number>>): Record<StoryDim, number> =>
  ({ ...Object.fromEntries(STORY_DIMS.map((d) => [d, 0])), ...p }) as Record<StoryDim, number>;

const g = (p: Partial<Record<GameDim, number>>): Record<GameDim, number> => {
  const base = Object.fromEntries(GAME_DIMS.map((d) => [d, 0.5])) as Record<GameDim, number>;
  return { ...base, ...p };
};

// Auto-generated by scripts/fetch-champions.mjs from DDragon ${VERSION}.
// Hand-crafted overrides for the seed champions are embedded in that script.
export const CHAMPIONS: Champion[] = [
${champions
  .map(
    (c) => `  {
    id: ${JSON.stringify(c.id)},
    name: ${JSON.stringify(c.name)},
    nameJa: ${JSON.stringify(c.nameJa)},
    title: ${JSON.stringify(c.title)},
    titleJa: ${JSON.stringify(c.titleJa)},
    region: ${JSON.stringify(c.region)},
    ddragonId: ${JSON.stringify(c.ddragonId)},
    roles: ${JSON.stringify(c.roles)},
    archetypes: ${JSON.stringify(c.archetypes)},
    storyVec: s(${fmt(c.storyVec)}),
    gameVec: g(${fmt(c.gameVec)}),
    blurb: ${JSON.stringify(c.blurb)},
  }`,
  )
  .join(",\n")},
];

export const CHAMPION_BY_ID: Record<string, Champion> = Object.fromEntries(
  CHAMPIONS.map((c) => [c.id, c]),
);

export const DDRAGON_VERSION = ${JSON.stringify(VERSION)};
export const championPortrait = (ddragonId: string): string =>
  \`https://ddragon.leagueoflegends.com/cdn/\${DDRAGON_VERSION}/img/champion/\${ddragonId}.png\`;
`;

const outPath = path.join(ROOT, "lib", "champions.ts");
writeFileSync(outPath, out);
console.error(`Wrote ${champions.length} champions to ${outPath}`);
