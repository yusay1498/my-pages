# my-pages

個人の学習アウトプットブログです。Markdown で記事を書き、静的サイトとしてデプロイします。

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) 16 (App Router / Static Export)
- **言語**: TypeScript
- **UI**: React 19 + [Tailwind CSS](https://tailwindcss.com/) v4
- **Markdown**: [marked](https://marked.js.org/) + [Mermaid](https://mermaid.js.org/)
- **リンター / フォーマッター**: ESLint + Prettier
- **バリデーション**: [Zod](https://zod.dev/)

## セットアップ

```bash
npm install
npm run dev
```

開発サーバーが `http://localhost:3000` で起動します。

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 静的サイトをビルド（`out/rss.xml` も生成） |
| `npx serve@latest out` | ビルド済みの静的サイト（`out/`）を配信 |
| `npm run lint` | ESLint を実行 |
| `npm run check-types` | TypeScript の型チェック |

## RSSフィード

- ビルド時（`npm run build`）に `out/rss.xml` を生成します。
- GitHub Pages公開時のURLは `https://yusay1498.github.io/my-pages/rss.xml` です。

## ディレクトリ構成

[bulletproof-react](https://github.com/alan2207/bulletproof-react) を参考に、feature ベースのディレクトリ構成を採用しています。

```
src/
├── app/          # Next.js App Router（ページ・レイアウト）
├── components/   # 共通 UI コンポーネント
├── config/       # パス定義などの設定
├── features/     # 機能ごとのモジュール（blog）
├── styles/       # グローバル CSS
└── utils/        # ユーティリティ関数
posts/            # Markdown 記事データ
```

詳細な設計方針は [docs/DESIGN.md](./docs/DESIGN.md) を参照してください。

## 記事の追加方法

1. `posts/` 配下にスラッグ名のディレクトリを作成（例: `posts/my-new-post`）
2. `meta.json` を作成し、メタ情報を記述:
   ```json
   {
     "title": "記事タイトル",
     "description": "記事の説明",
     "tags": ["tag1", "tag2"],
     "createdAt": "2025-01-01",
     "updatedAt": "2025-01-01",
     "status": "published"
   }
   ```
3. `{番号}.{スラッグ}.md` 形式で Markdown ファイルを作成（例: `1.introduction.md`）

## ライセンス

[LICENSE](./LICENSE) を参照してください。
