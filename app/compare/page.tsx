import CompareClient from "./compare-client";

export const metadata = {
  title: "ストーリー × ゲーム性能 比較 - LOLキャラタイプ診断",
  description: "両方のエントリーで診断した結果を並べて、一致するチャンピオンを確認します。",
};

export default function ComparePage() {
  return <CompareClient />;
}
