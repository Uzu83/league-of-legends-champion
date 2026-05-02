import ChampionsIndexClient from "./champions-client";
import { CHAMPIONS } from "@/lib/champions";

export const metadata = {
  title: "全チャンピオン一覧",
  description: "172体のLOLチャンピオン一覧。ロール / リージョン / アーキタイプで絞り込み。",
};

export default function ChampionsPage() {
  return <ChampionsIndexClient champions={CHAMPIONS} />;
}
