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
| デプロイ | GitHub Actions → GitHub Pages |

## 3. ディレクトリ構成

```
my-pages/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # トップページ（テーマ一覧）
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx              # テーマ別ページ
│   ├── components/                       # 共通UIコンポーネント
│   ├── config/                           # アプリ設定
│   ├── features/                         # 機能単位のモジュール
│   │   └── blog/
│   │       ├── components/
│   │       │   ├── PostCard.tsx          # テーマカード（一覧用）
│   │       │   └── ArticleSection.tsx    # 記事セクション（テーマページ用）
│   │       ├── lib/
│   │       │   └── posts.ts             # Markdown読み込み・解析ロジック
│   │       └── types/
│   │           └── index.ts             # ブログ関連の型定義
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

## 5. URL設計

| URL | 表示内容 |
|---|---|
| `/` | トップページ（publishedなテーマ一覧） |
| `/posts/{テーマスラッグ}` | テーマページ（配下の記事を番号順にまとめて表示） |

## 6. ページ仕様

### トップページ (`/`)

- publishedなテーマをカード形式で一覧表示
- 表示情報: タイトル、説明、タグ、更新日
- 並び順: updatedAtの降順

### テーマページ (`/posts/{slug}`)

- テーマタイトル・タグを上部に表示
- 配下のMarkdownを番号順にすべて結合して1ページに表示
- 記事間にセパレーターを入れる
- 目次（Table of Contents）を自動生成する

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

- タグ別一覧ページ
- ダークモード切り替え
- OGP画像の自動生成
- RSS フィード
- 全文検索
