# Yusay's TIL - 設計書

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| サイト名 | Yusay's TIL |
| 目的 | 個人の学習アウトプットをブログ形式で公開する |
| 公開方法 | GitHub Pages |
| リポジトリ | yusay1498/my-pages (public) |

## 2. 技術スタック

| 要素 | 技術 |
|---|---|
| フレームワーク | Next.js (Static Export) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 記事形式 | Markdown |
| Markdown解析 | marked + gray-matter |
| HTMLサニタイズ | isomorphic-dompurify |
| ダイアグラム描画 | mermaid.js（Markdown内の mermaid コードブロックを図として表示） |
| コメント機能 | giscus（GitHub Discussions ベース） |
| デプロイ | GitHub Actions → GitHub Pages |

## 3. ディレクトリ構成

```
my-pages/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # トップページ（テーマ一覧 + リンクセクション）
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # テーマ別ページ
│   │   └── projects/
│   │       └── page.tsx                  # Projectsページ（リポジトリ一覧）
│   ├── components/                       # 共通UIコンポーネント
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── config/                           # アプリ設定
│   ├── features/                         # 機能単位のモジュール
│   │   ├── blog/
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx          # テーマカード（一覧用）
│   │   │   │   ├── ArticleSection.tsx    # 記事セクション（テーマページ用）
│   │   │   │   └── MermaidBlock.tsx      # Mermaidダイアグラム描画（Client Component）
│   │   │   ├── lib/
│   │   │   │   └── posts.ts             # Markdown読み込み・解析ロジック
│   │   │   └── types/
│   │   │       └── index.ts             # ブログ関連の型定義
│   │   └── projects/
│   │   │   ├── components/
│   │   │   │   ├── ProjectCard.tsx       # プロジェクトカード（一覧用）
│   │   │   │   └── LanguageBadge.tsx     # 言語バッジ表示
│   │   │   ├── lib/
│   │   │   │   └── github.ts            # GitHub API データ取得ロジック
│   │   │   └── types/
│   │   │       └── index.ts             # プロジェクト関連の型定義
│   │   ├── search/
│   │   │   ├── components/
│   │   │   │   ├── SearchButton.tsx      # 検索ボタン（Header用）
│   │   │   │   └── SearchDialog.tsx      # 検索ダイアログ（モーダル）
│   │   │   ├── lib/
│   │   │   │   ├── searcher.ts           # Fuse.js を使った検索ロジック
│   │   │   │   └── useSearch.ts          # 検索カスタムフック
│   │   │   └── types/
│   │   │       └── index.ts             # 検索関連の型定義
│   │   └── portfolio/
│   │       ├── components/
│   │       │   └── LinksSection.tsx      # トップページのリンクセクション
│   │       ├── data/
│   │       │   ├── portfolio-sites.ts    # ポートフォリオサイトデータ
│   │       │   └── external-profiles.ts  # 外部プロフィールデータ
│   │       └── types/
│   │           └── index.ts             # ポートフォリオ関連の型定義
│   ├── hooks/                            # 共通カスタムフック
│   ├── lib/                              # 共通ユーティリティ（外部ライブラリのラッパー等）
│   ├── styles/                           # グローバルスタイル
│   ├── types/                            # 共通型定義
│   └── utils/                            # 汎用ユーティリティ関数
├── posts/                                # 記事管理ディレクトリ
│   ├── ai-usage/
│   │   ├── meta.json
│   │   ├── 1.Introduction.md
│   │   ├── 2.prompt-tips.md
│   │   └── 3.best-practices.md
│   └── docker-basics/
│       ├── meta.json
│       └── 1.what-is-docker.md
├── public/
│   └── images/
│       └── ai-usage/
├── docs/
│   └── DESIGN.md                         # 本設計書
├── next.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

### ディレクトリ設計方針

ディレクトリ構成は [bulletproof-react](https://github.com/alan2207/bulletproof-react) のプロジェクト構造を参考にしています。feature ベースでモジュールを分離し、各機能の凝集度を高める設計です。

| ディレクトリ | 役割 |
|---|---|
| `src/features/` | 機能単位で閉じたモジュール。各featureは独自のcomponents/lib/typesを持つ |
| `src/components/` | 複数featureから共通で使うUIコンポーネント |
| `src/lib/` | 外部ライブラリのラッパーや共通処理 |
| `src/hooks/` | 複数featureから共通で使うカスタムフック |
| `src/utils/` | 汎用ユーティリティ（日付フォーマット等） |
| `src/types/` | アプリ全体で共有する型定義 |
| `src/config/` | 環境変数やアプリ設定 |

### featuresのルール

- 1機能 = 1ディレクトリ（例: `features/blog/`）
- feature内は `components/`, `lib/`, `types/` 等を自由に配置
- feature間の直接参照は避け、共通化するなら `src/` 直下に昇格させる

## 4. 記事管理ルール

### ディレクトリ構成

- `posts/{テーマスラッグ}/` にテーマ単位で記事をまとめる
- 1テーマ = 1ページとして表示される（配下の記事を番号順に結合）

### テーマメタ情報 (`meta.json`)

```json
{
  "title": "AIの使い方",
  "description": "AIを活用するための学習ノート",
  "tags": ["AI", "初心者向け"],
  "createdAt": "2026-05-16",
  "updatedAt": "2026-05-16",
  "status": "draft"
}
```

| フィールド | 必須 | 説明 |
|---|---|---|
| title | ✅ | テーマのタイトル（ページ見出し・一覧表示に使用） |
| description | ✅ | テーマの概要（一覧表示・OGP・SEOに使用） |
| tags | ✅ | 関連タグ（タグ検索・フィルタに使用） |
| createdAt | ✅ | テーマ作成日 |
| updatedAt | ✅ | 最終更新日（新しい記事追加時に更新） |
| status | ✅ | `draft` or `published`（draftはビルド時に非公開） |

### 記事ファイル命名規則

```
{番号}.{スラッグ}.md
```

- 番号: 表示順（1始まり）
- スラッグ: 英数字+ハイフン（内容が分かる名前）
- フロントマター不要（メタ情報はmeta.jsonで一元管理）

### 対応Markdown記法

| 記法 | 表示 |
|---|---|
| 標準Markdown（marked準拠） | テキスト・見出し・リスト・リンク・画像・コードブロック等 |
| ` ```mermaid ` コードブロック | mermaid.js によるダイアグラム描画（フローチャート、シーケンス図、gitGraph等） |

## 5. URL設計

| URL | 表示内容 |
|---|---|
| `/` | トップページ（publishedなテーマ一覧 + リンクセクション） |
| `/posts/{テーマスラッグ}` | テーマページ（配下の記事を番号順にまとめて表示） |
| `/tags/{タグ名}` | タグ別の記事一覧ページ（タグに一致するpublished記事） |
| `/projects` | Projects ページ（GitHub パブリックリポジトリ一覧） |

## 6. ページ仕様

### トップページ (`/`)

- publishedなテーマをカード形式で一覧表示
- 表示情報: タイトル、説明、タグ、更新日
- 並び順: updatedAtの降順
- リンクセクション: ポートフォリオサイト・外部プロフィール・Projectsページへの導線

### OGP画像・メタデータ

- Next.js App Router の `opengraph-image` でOGP画像を静的生成する
- 生成対象:
  - `/opengraph-image.png`（トップページ）
  - `/projects/opengraph-image.png`（Projectsページ）
  - `/posts/{記事スラッグ}/opengraph-image.png`（記事詳細ページ）
- 記事詳細ページは `meta.json` の `title` / `description` をOGP画像と metadata に利用する
- OGP画像はビルド時にHTMLと同時に生成される
- metadata は `openGraph` / `twitter` / canonical URL を各ページで設定する

### Projects ページ (`/projects`)

- GitHub API からビルド時にパブリックリポジトリ情報を取得
- fork・archived は除外
- カード形式で一覧表示（リポジトリ名、説明、言語、スター数、フォーク数、トピック、更新日）
- `GITHUB_TOKEN` 環境変数で API レート制限を緩和（GitHub Actions では自動提供）
- API が利用不可の場合はビルドを止めず空一覧を表示

### テーマページ (`/posts/{slug}`)

- テーマタイトル・タグを上部に表示
- 配下のMarkdownを番号順にすべて結合して1ページに表示
- 記事間にセパレーターを入れる
- 目次（Table of Contents）を自動生成する
- Mermaidコードブロックはクライアント側でダイアグラムとして描画する
- ページ下部に giscus によるコメントセクションを表示する

### 全文検索

- ビルド時に `search-index.json` を生成（タイトル・説明・タグ・本文を含む）
- Fuse.js によるクライアントサイドあいまい検索
- Header の検索ボタンからモーダルダイアログで検索
- 検索対象: タイトル（重み3）、説明（重み2）、タグ（重み2）、本文（重み1）
- 検索結果はリンク付きで表示（タイトル・説明・タグ）
- キーボードショートカット: Escape で閉じる

## 7. デプロイ

### GitHub Actions ワークフロー

- トリガー: `master` ブランチへのpush
- ステップ:
  1. `yarn install`
  2. `next build`（Static Export）
  3. GitHub Pagesにデプロイ

### 公開条件

- `meta.json` の `status` が `published` のテーマのみ公開
- `draft` のテーマはビルド時にスキップ

## 8. スマホからの執筆フロー

1. GitHubモバイルアプリまたはブラウザで `posts/{テーマ}/` を開く
2. 新しいmdファイルを作成（例: `3.new-topic.md`）
3. コミット → GitHub Actionsが自動ビルド → 公開

### 新テーマ追加時

1. `posts/` に新ディレクトリを作成
2. `meta.json` を作成（`status: "draft"`）
3. 記事ファイルを追加
4. 公開準備ができたら `status` を `published` に変更

## 9. コーディング規約

| 項目 | ルール |
|---|---|
| フォーマッター | Prettier |
| リンター | ESLint |
| コミット時チェック | husky + lint-staged |
| コンポーネント | 関数コンポーネント + TypeScript |
| スタイリング | Tailwind CSSのユーティリティクラス |
| インポート順 | eslint-plugin-import で自動整理 |

## 10. 今後の拡張予定（未実装）

### サイト機能

- 記事の読了時間表示（日本語: 約500文字/分で推定）
- 関連記事の表示（タグの類似度ベースでレコメンド）
- シンタックスハイライト強化（Shiki への移行）
- i18n 対応（英語版記事を `posts/en/` に配置して多言語化）

### SEO / ディスカバラビリティ

- サイトマップ自動生成（ビルド時に `out/sitemap.xml` を出力、RSS と同じパターン）
- JSON-LD 構造化データ（`BlogPosting` スキーマを各記事に埋め込み → Google リッチリザルト対応）
- canonical URL の設定（各ページに `<link rel="canonical">` を追加）

### アナリティクス / フィードバック

- アクセス解析（プライバシー重視: Plausible or Umami セルフホスト）
- 「役に立った」ボタン（GitHub API で Issue にリアクションを付ける簡易フィードバック）

### パフォーマンス / DX

- Lighthouse CI（GitHub Actions で毎回スコア計測、閾値未満で警告）
- 画像の自動最適化（sharp でビルド時にリサイズ + WebP/AVIF 変換）
- プレビュー環境（PR ごとにプレビューデプロイ: Cloudflare Pages or Vercel）
- 記事テンプレート CLI（`npm run new-post <slug>` でディレクトリ + meta.json を自動生成）
- Markdown リンク切れチェック（ビルド時 or CI で内部リンクの死活監視）

### 学習・ポートフォリオ拡張

- TIL カレンダー（GitHub の草のように記事投稿日をヒートマップ表示）
- 学習ロードマップ（Mermaid で技術学習の進捗を可視化するページ）
- スキルマトリクス（技術スタック × 習熟度をレーダーチャートやバッジで表示）
- 読書ログ / 資格ログ（技術書や資格の記録を別 feature として管理）

### API Playground（Java学習用）

- Java学習用REST APIの公開（Spring Boot等、別リポジトリで構築・デプロイ）
- APIレスポンスの表示機能（fetch → JSON整形表示）
- インタラクティブなお試し機能（パラメータ入力 → リクエスト送信 → レスポンス表示）
- Java と `curl` のサンプルコード併記
