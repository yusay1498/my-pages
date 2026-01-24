# GitHub Pagesデプロイ設定手順

このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

## 必要な設定

### 1. GitHub Pagesの有効化

リポジトリの設定でGitHub Pagesを有効にする必要があります：

1. GitHubリポジトリページで **Settings** タブを開く
2. 左サイドバーから **Pages** を選択
3. **Build and deployment** セクションで：
   - **Source** を **GitHub Actions** に設定

### 2. Workflowの権限設定

デフォルトでGitHub Actionsには適切な権限が設定されていますが、念のため確認してください：

1. GitHubリポジトリページで **Settings** タブを開く
2. 左サイドバーから **Actions** → **General** を選択
3. **Workflow permissions** セクションで：
   - **Read and write permissions** を選択（推奨）
   - または **Read repository contents and packages permissions** を選択し、必要に応じて個別の権限を付与

## デプロイ方法

### 自動デプロイ

`master` ブランチにプッシュすると、自動的にビルドとデプロイが実行されます。

### 手動デプロイ

GitHubのActionsタブから手動でワークフローを実行できます：

1. リポジトリの **Actions** タブを開く
2. 左サイドバーから **Deploy to GitHub Pages** ワークフローを選択
3. **Run workflow** ボタンをクリック
4. ブランチを選択して **Run workflow** を実行

## デプロイ先URL

デプロイが成功すると、以下のURLでサイトにアクセスできます：

```
https://<username>.github.io/<repository-name>/
```

例: `https://yusay1498.github.io/my-pages/`

## 注意事項

- **Secretの設定は不要です** - GitHub PagesへのデプロイにはCLOUDFLARE_API_TOKENやCLOUDFLARE_ACCOUNT_IDなどのシークレットは必要ありません
- **環境変数の設定** - ワークフローファイル（`.github/workflows/deploy.yml`）内の環境変数は、実際の環境に合わせて更新してください：
  - `NEXT_PUBLIC_BASE_PATH`: GitHubのリポジトリ名（デフォルト: `/my-pages`）
  - `NEXT_PUBLIC_API_URL`: 実際のAPI URL（現在はプレースホルダー値 `https://api.example.com`）
  - `NEXT_PUBLIC_URL`: デプロイ先のURL
- Next.jsの静的エクスポートが有効になっているため、動的なサーバーサイド機能（API Routes、Server Components等）は使用できません
- 画像最適化機能は無効化されています（GitHub Pagesでは対応していないため）
- 動的ルートのサポート - 現在は各動的ルートで3つのページ（ID: '1', '2', '3'）が生成されます。本番環境では、実際のデータソースからIDを取得するように`generateStaticParams()`を更新してください

## トラブルシューティング

### デプロイが失敗する場合

1. **Actions**タブでワークフローのログを確認
2. ビルドエラーの場合は、ローカルで`npm run build`を実行して問題を特定
3. 権限エラーの場合は、上記の「Workflowの権限設定」を確認

### ページが表示されない場合

1. Settings → Pages でGitHub Pagesが正しく設定されているか確認
2. デプロイ完了後、反映まで数分かかる場合があります
3. ブラウザのキャッシュをクリアして再度アクセス
