# LOL キャラタイプ診断

> あなたとLOLキャラを繋ぐ、世界観の入り口診断。

性格・プレイ志向の質問10問×2エントリーで、172体のLeague of Legendsチャンピオンから最もマッチする1体 + 上位5体を提示するWeb診断サービス。

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
| Champion data | DDragon `16.9.1 / ja_JP` |

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
| `/sitemap.xml` `/robots.txt` | Static | SEO |

## デプロイ

GitHub → Vercel 自動連携。`main` への push でビルド・デプロイ。

### 環境変数

| Var | Required | Purpose |
| ---- | ---- | ---- |
| `NEXT_PUBLIC_SITE_URL` | Yes (本番) | sitemap / robots / metadataBase が参照。例: `https://lol-character-type.vercel.app` |

未設定時は `https://lol-character-type.example.com` フォールバック。

## 規約

- **全UIテキストは日本語**。i18n は将来 (Tier 3)
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
pnpm test                                      # 全12テスト
pnpm test tests/scoring.test.ts                # 特定ファイル
```

スコアリング・エンコーディング・persona生成・ランキングのユニットテスト。チャンピオン名で固定アサーションせず、ベクトルプロパティ (`damageStyle >= 0.5` 等) で検証 — チャンピオンデータが変わっても壊れにくい設計。

## ライセンス・帰属

- League of Legends は Riot Games の登録商標。本サイトは非公式ファンメイド。
- チャンピオン名・肖像は [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) より取得。

## ロードマップ

仕様詳細は [Notion ページ (private)](https://app.notion.com/p/3541ef8488d581819de6ede4a562d202) を参照。

近い順:

1. 142体の自動推定値の手作業レビュー
2. `NEXT_PUBLIC_SITE_URL` 連動の `shareUrl` 移行
3. Vercel Analytics 連携 (診断開始/完了/離脱)
4. アクセシビリティ (キーボード操作・ARIA)
5. チャンピオン詳細ページからの逆引きシェア
