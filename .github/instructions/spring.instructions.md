---
applyTo: "**/*.java"
---

# Spring Boot 固有レビュー観点

## アーキテクチャ/レイヤー構成（最重要）

本プロジェクトは以下の4層構成を採用する：

| 層 | パッケージ名 | 責務 |
|---|---|---|
| Presentation | `presentation` | Controller（REST/Kafka Listener/Scheduler）、リクエスト/レスポンス型 |
| Application | `application` | ユースケース、アプリケーションサービス、トランザクション境界、認可制御 |
| Domain | `domain` | Entity、ValueObject、Aggregate、DomainService、Repositoryインターフェース |
| Infrastructure | `infrastructure` | Repository実装（PostgreSQL）、DAO |

例外的に `config`（横断的設定）が各層を参照することは許容する。

### 依存ルール（厳守）
- `domain` は他のいかなる層にも依存してはならない（純粋なビジネスロジック）
- 依存方向: `presentation → application → domain ← infrastructure`
- Repository のインターフェースは `domain` に定義し、実装は `infrastructure` に置く（依存性逆転）
- `presentation` が `domain` を直接参照してはならない（必ず `application` 経由）
- 層を跨ぐ逆方向の依存は絶対に許容しない
- 各層で必要な入出力型はその層内で定義する（層を跨ぐ共通DTOクラスは作らない）

### Presentation層
- Controller、KafkaListener、Scheduler 等、システム外部からのトリガーを受け取る機能群を配置する
- リクエスト/レスポンス型はこの層内で定義する

### Application層
- 複数のDomainServiceやEntityを調整してユースケースを実行する
- トランザクション境界（`@Transactional`）はこの層で管理する
- 認可制御（`@PreAuthorize`、`@PostAuthorize`、メタアノテーション）はこの層で管理する

### Domain層
- Entity、Aggregate、ValueObject、DomainService、Repositoryインターフェースを配置する
- ビジネスロジックはDomainServiceまたはAggregate/Entityのメソッドとして表現する
- Aggregateはデータの一貫性と整合性を保持するエントリーポイントを提供する

### Infrastructure層
- Domain層で定義されたRepositoryインターフェースの具体的な実装を提供する
- DAO（データアクセスオブジェクト）によるデータベース操作の抽象化を行う

## DI/コンポーネント設計
- コンストラクタインジェクションを使用しているか（`@Autowired` フィールドインジェクションを避ける）
- `@Component` / `@Service` / `@Repository` の使い分けが責務に合っているか
- 循環依存が発生していないか

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
- トランザクション境界（`@Transactional`）が適切か（読み取り専用には `readOnly = true`）
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
