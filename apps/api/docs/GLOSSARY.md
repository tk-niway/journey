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

| 用語            | 説明                                                       | 配置場所                                                         |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Handler         | APIルートのビジネスロジック呼び出し部分                    | `api/routes/{feature}/{action}.handler.ts`                       |
| Schema          | Zodによるバリデーション定義 + OpenAPIルート定義            | `api/routes/{feature}/{action}.schema.ts`                        |
| Route           | Honoのルート定義、エンドポイントとHTTPメソッドの組み合わせ | `api/routes/{feature}/index.ts`                                  |
| Application     | ユースケースを実装するクラス                               | `applications/{domain}/{domain}.application.ts`                  |
| Entity          | 集約ルート、ライフサイクルを持つオブジェクト               | `domains/{domain}/entities/{domain}.entity.ts`                   |
| Value           | 値オブジェクト、不変、等価性で比較                         | `domains/{domain}/values/{domain}.value.ts`                      |
| Factory         | エンティティ・値オブジェクトの生成を担当                   | `domains/{domain}/factories/{domain}.factory.ts`                 |
| Repository      | データ永続化の抽象化（インターフェース）                   | `domains/{domain}/repositories/{domain}-repository.interface.ts` |
| TableRepository | リポジトリの実装（Drizzle ORM使用）                        | `db/repositories/{domain}/{domain}-table.repository.ts`          |
| DomainError     | ドメイン層で発生するエラー                                 | `domains/{domain}/errors/{domain}.error.ts`                      |
| DbError         | データベース層で発生するエラー                             | `db/repositories/{domain}/{domain}-table.error.ts`               |
| TestRepository  | テスト用のDB操作リポジトリ。テストデータ準備に使用         | `db/repositories/test/test.repository.ts`                        |
| TestHelper      | テスト用ヘルパー関数（cleanupAllTablesなど）               | `db/lib/helpers/database.test-helper.ts`                         |
| TestFactory     | テスト用のファクトリー。テストデータ生成に使用             | `domains/{domain}/factories/{domain}.test-factory.ts`            |

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

## エラーコード一覧

| コード                   | エラークラス            | 説明                             |
| ------------------------ | ----------------------- | -------------------------------- |
| `USER_ID_ALREADY_EXISTS` | UserAlreadyExistsError  | 同じIDのユーザーが既に存在       |
| `EMAIL_ALREADY_EXISTS`   | EmailAlreadyExistsError | 同じメールアドレスが既に登録済み |
| `USER_NOT_FOUND`         | UserNotFoundError       | ユーザーが見つからない           |
| `INVALID_PASSWORD`       | InvalidPasswordError    | パスワードが間違っている         |

## HTTPステータスコード

| コード | 用途                                 |
| ------ | ------------------------------------ |
| 200    | 成功（GET, PUT, PATCH）              |
| 201    | 作成成功（POST）                     |
| 204    | 成功（DELETE、レスポンスボディなし） |
| 400    | バリデーションエラー                 |
| 401    | 認証エラー                           |
| 403    | 認可エラー（権限なし）               |
| 404    | リソースが見つからない               |
| 409    | コンフリクト（重複など）             |
| 500    | サーバーエラー                       |
