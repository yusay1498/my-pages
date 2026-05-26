---
applyTo: "**/*.java"
---

# Spring Boot 固有レビュー観点

## DI/コンポーネント設計
- コンストラクタインジェクションを使用しているか（`@Autowired` フィールドインジェクションを避ける）
- `@Component` / `@Service` / `@Repository` の使い分けが責務に合っているか
- 循環依存が発生していないか

## トランザクション管理
- `@Transactional` がApplication層（サービスクラス）に適切に設定されているか
- 読み取り専用には `readOnly = true` を指定しているか
- トランザクションの伝播属性が適切か

## 認可制御
- メソッドセキュリティ（`@PreAuthorize`、`@PostAuthorize`）がApplication層で適用されているか
- メタアノテーション（`@IsAdmin` 等）を活用して認可ルールを見通しよく表現しているか

## REST API 設計
- HTTPメソッド・ステータスコードのセマンティクスが正しいか
- リクエスト/レスポンスの型に `record` を活用しているか
- バリデーション（`@Valid`、`@NotNull` 等）が適切に設定されているか

## エラーハンドリング
- `@RestControllerAdvice` でグローバルな例外ハンドリングを行っているか
- エラーレスポンスは [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html) に準拠しているか
- Spring の [`ProblemDetail`](https://spring.pleiades.io/spring-framework/docs/current/javadoc-api/org/springframework/http/ProblemDetail.html) を活用しているか
- エラーレスポンスにスタックトレースや内部実装の情報を含めていないか

## データアクセス
- N+1 問題が発生していないか
- エンティティをそのままレスポンスに返していないか（層ごとに型を分離）

## セキュリティ（最重要）
- 認証・認可の設定が適切か（Spring Security の設定漏れがないか）
- エンドポイントのアクセス制御が明示的に設定されているか（デフォルト許可になっていないか）
- CORS設定が最小限に制限されているか
- CSRF対策が適切か（API専用なら無効化の根拠があるか）
- 機密情報がレスポンスボディ・ヘッダーに漏洩していないか
- パスワードが `BCryptPasswordEncoder` 等で適切にハッシュ化されているか
- Rate Limiting / ブルートフォース対策が考慮されているか
- 依存ライブラリに既知の脆弱性がないか
- `@Valid` によるバリデーションが全ての外部入力に適用されているか

## 設定/プロファイル
- 環境依存の値が外部化（`application.yml`、環境変数）されているか
- ハードコードされたマジックナンバーや接続情報がないか
- プロファイル（`dev` / `prod`）による切り替えが適切か
