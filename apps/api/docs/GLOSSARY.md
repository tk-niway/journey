# 用語集

このドキュメントは、プロジェクトで使用する用語を定義します。

## ドメイン用語

| 用語     | 英語       | 説明                                       |
| -------- | ---------- | ------------------------------------------ |
| ユーザー | User       | サービスを利用する人                       |
| 認証情報 | Credential | パスワードハッシュなど、認証に使用する情報 |
| ノート   | Note       | ユーザーが作成するメモ・記録               |
| タグ     | Tag        | ノートに付けるラベル・分類                 |

## 技術用語（このプロジェクトでの意味）

| 用語             | 説明                                                       | 配置場所                                                         |
| ---------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Handler          | APIルートのビジネスロジック呼び出し部分                    | `api/routes/{feature}/{action}.handler.ts`                       |
| Schema           | Zodによるバリデーション定義 + OpenAPIルート定義            | `api/routes/{feature}/{action}.schema.ts`                        |
| Route            | Honoのルート定義、エンドポイントとHTTPメソッドの組み合わせ | `api/routes/{feature}/index.ts`                                  |
| Application      | ユースケースを実装するクラス                               | `applications/{domain}/{domain}.application.ts`                  |
| Entity           | 集約ルート、ライフサイクルを持つオブジェクト               | `domains/{domain}/entities/{domain}.entity.ts`                   |
| Value            | 値オブジェクト、不変、等価性で比較                         | `domains/{domain}/values/{domain}.value.ts`                      |
| Factory          | エンティティ・値オブジェクトの生成を担当                   | `domains/{domain}/factories/{domain}.factory.ts`                 |
| Repository       | データ永続化の抽象化（インターフェース）                   | `domains/{domain}/repositories/{domain}-repository.interface.ts` |
| TableRepository  | リポジトリの実装（Drizzle ORM使用）                        | `db/repositories/{domain}/{domain}-table.repository.ts`          |
| DomainError      | ドメイン層で発生するエラー（DomainErrorAbstract継承）      | `domains/{domain}/errors/{domain}.error.ts`                      |
| DbError          | データベース層で発生するエラー（DbErrorAbstract継承）      | `db/repositories/{domain}/{domain}-table.error.ts`               |
| ApiError         | API層で発生するエラー（認証等、statusCode持つ）            | `api/lib/errors/api.error.ts`                                    |
| ErrorCode        | エラーコードenum（バックエンド・フロントエンド共有）       | `shared/error-code.const.ts`                                     |
| ERROR_STATUS_MAP | エラークラス名→ErrorCode+statusCodeのマッピング            | `api/lib/errors/error-status.helper.ts`                          |
| TestRepository   | テスト用のDB操作リポジトリ。テストデータ準備に使用         | `db/repositories/test/test.repository.ts`                        |
| TestHelper       | テスト用ヘルパー関数（cleanupAllTablesなど）               | `db/lib/helpers/database.test-helper.ts`                         |
| TestFactory      | テスト用のファクトリー。テストデータ生成に使用             | `domains/{domain}/factories/{domain}.test-factory.ts`            |

## レイヤー用語

| 用語           | 説明                                                  |
| -------------- | ----------------------------------------------------- |
| api層          | プレゼンテーション層。HTTPリクエスト/レスポンスを処理 |
| applications層 | アプリケーション層。ユースケースを実装                |
| domains層      | ドメイン層。ビジネスロジックを実装                    |
| db層           | インフラ層。データベースアクセスを実装                |
| lib層          | 共通ユーティリティ。各層から参照可能                  |

## 命名規則パターン

| 概念                       | 命名パターン        | 例                                          |
| -------------------------- | ------------------- | ------------------------------------------- |
| ユーザー関連エンティティ   | User\*              | `UserEntity`, `UserValue`                   |
| テーブル                   | \*Table             | `usersTable`, `notesTable`                  |
| リポジトリインターフェース | \*Repository        | `UserRepository`, `NoteRepository`          |
| リポジトリ実装             | \*TableRepository   | `UsersTableRepository`                      |
| アプリケーション           | \*Application       | `AuthApplication`, `UserApplication`        |
| ドメインエラー             | \*Error             | `UserNotFoundError`, `InvalidPasswordError` |
| DBエラー                   | \*DbError           | `UserCreateDbError`                         |
| ファクトリー               | \*Factory           | `UserFactory`, `NoteFactory`                |
| テスト用ファクトリー       | \*TestFactory       | `UserTestFactory`                           |
| 値オブジェクト型           | \*ValueObject       | `UserValueObject`                           |
| 値オブジェクトクラス       | \*Value             | `UserValue`                                 |
| スキーマ型                 | *Request, *Response | `LoginRequest`, `LoginResponse`             |
| ルート定義                 | \*Route             | `loginRoute`, `signupRoute`                 |

## ファイル命名パターン

| サフィックス       | 用途                    | 例                          |
| ------------------ | ----------------------- | --------------------------- |
| `.handler.ts`      | APIハンドラー           | `login.handler.ts`          |
| `.schema.ts`       | Zodスキーマ・ルート定義 | `login.schema.ts`           |
| `.entity.ts`       | エンティティクラス      | `user.entity.ts`            |
| `.value.ts`        | 値オブジェクトクラス    | `user.value.ts`             |
| `.factory.ts`      | ファクトリークラス      | `user.factory.ts`           |
| `.repository.ts`   | リポジトリ実装          | `users-table.repository.ts` |
| `.error.ts`        | エラークラス            | `user.error.ts`             |
| `.test.ts`         | 単体テスト              | `auth.application.test.ts`  |
| `.e2e.ts`          | E2Eテスト               | `login.e2e.ts`              |
| `.test-factory.ts` | テスト用ファクトリー    | `user.test-factory.ts`      |
| `-table.schema.ts` | Drizzleテーブル定義     | `users-table.schema.ts`     |
