# LOL キャラタイプ診断 / LoL Character Type Quiz

> ⚠️ **本サイトはRiot Games非公式のファンメイドプロジェクトです。**
> Riot Games, Inc. が公式承認・スポンサーするものではありません。
> League of Legends および Riot Games は Riot Games, Inc. の登録商標です。

> あなたとLOLキャラを繋ぐ、世界観の入り口診断。
> Find the League of Legends champion that matches your personality and playstyle.

性格・プレイ志向の質問10問×2エントリーで、172体のLeague of Legendsチャンピオンから最もマッチする1体 + 上位5体を提示するWeb診断サービス。**ja / en の2言語対応**。

**2エントリー設計**:
- 🌍 **ストーリー入り口** — 性格・価値観・関係性志向 (15軸ベクトル)
- ⚔️ **ゲーム性能入り口** — プレイスタイル (8軸双極ベクトル: 近距離↔遠距離 / AA↔スキル / DPS↔バースト / 耐久 / 火力 / CC / 機動 / 操作難易度)

診断後はもう一方のエントリーへ誘導 + `/compare` で並列比較。

---

## Stack

| Layer | Choice |
| ---- | ---- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Lang | TypeScript 6 (strict, `noUncheckedIndexedAccess`) |
| Style | Tailwind v4 (`@tailwindcss/postcss`) |
| State | Zustand 5 (sessionStorage 永続) |
| OG image | `next/og` (Edge runtime) |
| Test | Vitest 4 + Testing Library |
| Lint/Fmt | Biome 2 |
| Pkg | pnpm 10 (mise pinned) |
| Deploy | Vercel (GitHub 連携) |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` |
| Champion data | DDragon `16.9.1` (ja_JP + en_US) |
| i18n | 自前辞書 (`lib/i18n.ts`) — cookie優先 + Accept-Language fallback |

サイリウムカラー診断 (penlightcolor) v2 のスタックを完全継承。

## Getting started

ツールチェーンは `mise` で固定 (`.mise.toml`) されている。

```bash
mise install            # node 24 + pnpm 10
pnpm install
pnpm dev                # http://localhost:3000
```

### スクリプト

| Command | What |
| ---- | ---- |
| `pnpm dev` | 開発サーバ |
| `pnpm build` | プロダクションビルド (172体SSG) |
| `pnpm start` | プロダクション起動 |
| `pnpm test` | Vitest 1パス |
| `pnpm test:watch` | Vitest watch |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check` | Biome lint+format チェック |
| `pnpm fmt` | Biome format --write |
| `node scripts/fetch-champions.mjs` | DDragon から全172体を `lib/champions.ts` に再生成 |

## アーキテクチャ

### データフロー

```
/  (2-entry home)
  ├─→ /q/story  (Likert 10問, Zustand 永続)
  └─→ /q/game   (Likert 10問, Zustand 永続)
        ↓
       hash 生成 (e.g. "s5443215543")
        ↓
       /result/[hash]
        ├─ 上位1 + 上位5
        ├─ Persona 説明文 (lib/persona.ts)
        ├─ ユーザの8軸スコアバー
        ├─ 完全なる反対型 (距離最遠1体)
        └─ もう一方のエントリーへ誘導
        ↓
       /compare (両方診断済時のみ)
        └─ 一致チャンピオン強調
        ↓
       /api/og?hash=...  (Edge runtime, 1200×630 PNG)
```

ハッシュが diagnostic state そのもの。バックエンド・DB・ユーザー追跡なし (Stateless DNA)。

### スコアリング

`lib/scoring.ts`:

- 各質問は スパースな重みベクトル (例 `{ honor: 0.8, organization: 0.9 }`)
- Likert回答 `a ∈ {1..5}` を `(a-3)/2 ∈ [-1,1]` に正規化、重みと積をユーザベクトルに加算
- 各チャンピオンは `[0,1]^D` 内のベクトル → `2v - 1` で双極化してユーザベクトルとEuclidean距離計算
- 距離昇順でソート、上位 N + 最遠1を抽出

ストーリー軸: `D = 15` (10価値観 + 5関係性)
ゲーム軸: `D = 8` (range / skillBased / damageStyle / durability / damage / cc / mobility / difficulty)

### チャンピオンデータ

172体すべて `lib/champions.ts` に静的に格納 (DDragon `16.9.1 / ja_JP`)。

- 30体は `scripts/fetch-champions.mjs` の `HAND_CRAFTED` で手書きスコアを上書き
- 残り142体は DDragon の `info` (attack/defense/magic/difficulty 1-10) + `tags` から自動推定 (要レビュー)
- パッチ更新時は `node scripts/fetch-champions.mjs` で再生成 (HAND_CRAFTED は保持される)

### `next/og` 注意

`<div>` に複数子要素がある場合、`display: flex | contents | none` を inline style に**必ず**入れる。`flexDirection` だけでは足りない。

## ルート

| Route | Type | Purpose |
| ---- | ---- | ---- |
| `/` | Static | 2エントリー選択ホーム |
| `/q/[type]` | SSG | story / game の質問フロー |
| `/result/[hash]` | Dynamic | 診断結果 + Persona + 反対型 |
| `/champions` | Static (Client) | 全172体一覧 + 検索/フィルタ |
| `/champions/[id]` | SSG | チャンピオン詳細 (8軸双極バー) |
| `/compare` | Static (Client) | クロスエントリー比較ビュー |
| `/api/og` | Edge | 動的OGP画像 |
| `/sitemap.xml` `/robots.txt` | Static | SEO (hreflang ja/en alternates 付き) |
| `/manifest.webmanifest` | Static | PWA manifest |
| `/icon` `/apple-icon` | Static | 動的生成 favicon / Apple touch |

## デプロイ

GitHub → Vercel 自動連携。`main` への push でビルド・デプロイ。

### 環境変数

| Var | Required | Purpose |
| ---- | ---- | ---- |
| `NEXT_PUBLIC_SITE_URL` | 推奨 (本番) | sitemap / robots / metadataBase が参照。本番ドメイン: `https://league-of-legends-champion.vercel.app` |

未設定時は `https://league-of-legends-champion.vercel.app` フォールバック (本番ドメインを直書き)。カスタムドメイン取得時は env var で明示上書きする。

### Google Search Console

`app/layout.tsx` の `generateMetadata` で `verification.google` を出力済 (`<meta name="google-site-verification">`)。新しい所有権を追加する時は同じキーに値を差し替え。

## i18n

ja / en 両対応。

- 翻訳辞書は `lib/i18n.ts` に集約。型ベース (`Record<Locale, ...>`) なので追加言語はキーごとに値を埋めるだけ。
- ロケール解決は `lib/i18n-server.ts` の `getLocale()` (cookie `NEXT_LOCALE` > Accept-Language > `ja` フォールバック)。
- ヘッダー右上の `LocaleSwitcher` で切替 (cookie に保存して `location.reload()`)。
- 質問・persona 説明文・OGP・metadata すべてロケール対応。`/api/og?hash=...&lang=en` で言語別OGP画像生成。
- チャンピオン名 / 称号: `name` `title` (en) / `nameJa` `titleJa` (ja) を保持。EN blurbは `name + title + region + archetypes` から合成 (172体ハンドトランスレートしない方針)。

## 規約

- ja / en に対応 (2026-05-09より)。新文字列を追加する際は `lib/i18n.ts` の両ロケールに加えること。
- **曜日表示は日曜始まり**
- 語彙制約: `Go` / `Golang` / `REST API` 禁止 → `endpoint` または `API route`
- LOLキャラ既存設定の暗いテーマ (復讐・対立・死) は許容、ただしユーザーへ押し付けない (例「あなたは復讐に生きるべき」はNG)
- 政治・宗教・差別の現実世界マッピング禁止、摂食障害・自傷の言及禁止

### 承認ゲート (Approval Gates)

以下は実装前に確認:

- `package.json` への新規 dependency 追加
- Node / Next.js / Tailwind メジャーバージョン変更
- 環境変数 / デプロイ config 変更
- ファイル削除 / 大規模リファクタ

## テスト

```bash
pnpm test                                      # 全20テスト (scoring 12 + i18n 8)
pnpm test tests/scoring.test.ts                # 特定ファイル
```

スコアリング・エンコーディング・persona生成・ランキング・ロケール解決・ローカライズ済 persona のユニットテスト。チャンピオン名で固定アサーションせず、ベクトルプロパティ (`damageStyle >= 0.5` 等) で検証 — チャンピオンデータが変わっても壊れにくい設計。

## ライセンス・帰属

- League of Legends および Riot Games は Riot Games, Inc. の登録商標。**本サイトは非公式ファンメイド。**
- チャンピオン画像は [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) より取得。
- 本サイトは [Legal Jibber Jabber (Riot Fan Content Policy)](https://www.riotgames.com/ja/legal) に従って制作。

### 必須 disclaimer (フッターおよび結果ページに常設)

> LOLキャラタイプ診断はライアットゲームズが公式承認するものではなく、ライアットゲームズまたはリーグ・オブ・レジェンドの製作・管理に正式に関与した者の見解に基づくものではありません。リーグ・オブ・レジェンド及びライアットゲームズはRiot Games, Inc.の商標です。

## 商用化・運用ルール

Riot公式 [Legal Jibber Jabber](https://www.riotgames.com/ja/legal) に基づく、本プロジェクトでの遵守事項。

| 項目 | 可否 | メモ |
| ---- | ---- | ---- |
| AdSense等のパッシブ広告 | ✅ 条件付OK | 「不適切な広告」(ギャンブル・成人向け等) はRiot単独判断でNG。導入は様子を見ながら |
| ペイウォール / Patreon限定機能 | ❌ NG | サイト機能は全員無料アクセスが必須 |
| クラウドファンディング | ❌ NG | |
| スポンサーシップ契約 | ❌ NG | 個別企業ロゴ提示は書面ライセンス無しでは不可 |
| 法人化したビジネスエンティティ運営 | ❌ NG | 個人プレイヤーによるプロジェクトとしてのみ許可 |
| Riot/LoL ロゴ・商標画像の使用 | ❌ NG | 書面ライセンス無しでは不可。サイトロゴは自作テキストのみ |
| ドメイン/SNS名にRiot商標を含める | ❌ NG | 例: `leagueoflegends-shindan.com` はNG、固有造語ならOK |
| チャンピオン名・スプラッシュアート使用 | ✅ OK | Data Dragon CDN 経由で配信 |
| Data Dragon hot-link | ⚠️ 不明確 | 公式ドキュメントに明文化なし。実務上は許容されている運用 |
| disclaimer 表記 | ✅ 必須 | 上記必須文言を「目立つ場所」に常設 (フッター・About等) |

不安が残る論点 (DDragon hot-link、AdSense運用形態、商用判定の境界) は **jpinfo@riotgames.com** へ事前相談推奨。回答が記録に残ると最強の保険になる。

詳細な調査結果は [Notion §14](https://app.notion.com/p/3541ef8488d581819de6ede4a562d202) に記録。

## ロードマップ

仕様詳細は [Notion ページ (private)](https://app.notion.com/p/3541ef8488d581819de6ede4a562d202) を参照。

近い順:

1. 142体の自動推定値の手作業レビュー
2. アクセシビリティ (キーボード操作・ARIA)
3. チャンピオン詳細ページからの逆引きシェア
4. EN チャンピオン blurb のリッチ化 (現状は title+region+archetype 合成)
5. Playwright e2e
