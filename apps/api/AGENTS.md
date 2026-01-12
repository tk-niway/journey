# AGENTS.md

このファイルはAIコーディングエージェント向けの指示書です。
プロジェクト固有の詳細は `docs/PROJECT_RULES.md` を参照してください。

## 概要

このプロジェクトは以下のアーキテクチャ・規約に従います。

## アーキテクチャ: レイヤードアーキテクチャ

```
src/
├── api/           # プレゼンテーション層
├── applications/  # アプリケーション層（ユースケース）
├── domains/       # ドメイン層（ビジネスロジック）
├── db/            # インフラ層（データベース）
└── lib/           # 共通ユーティリティ
```

### レイヤー間の依存ルール

```
api → applications → domains ← db
                        ↑
                       lib
```

- **api層**: applications層のみを呼び出す
- **applications層**: domains層のインターフェースに依存
- **db層**: domains層のインターフェースを実装
- **domains層**: 他の層に依存しない（純粋なビジネスロジック）

## ディレクトリ構造の原則

### api層

機能ごとにディレクトリを分割し、関連ファイルをまとめる：

```
api/routes/{feature}/
├── index.ts              # ルート登録
├── {action}.handler.ts   # ハンドラー
├── {action}.schema.ts    # スキーマ・ルート定義
└── {action}.e2e.ts       # E2Eテスト
└── {action}.test.ts      # 単体テストまたはインテグレーションテスト
```

### domains層

ドメインごとにディレクトリを分割：

```
domains/{domain}/
├── entities/       # エンティティ（集約ルート）
├── values/         # 値オブジェクト
├── factories/      # ファクトリー
├── repositories/   # リポジトリインターフェース
├── services/       # ドメインサービス
└── errors/         # ドメインエラー
```

### applications層

```
applications/{domain}/
├── {domain}.application.ts       # ユースケース実装
└── {domain}.application.test.ts  # 単体テストまたはインテグレーションテスト
```

### db層

```
db/
├── schemas/       # テーブルスキーマ定義
└── repositories/  # リポジトリ実装（domains層のインターフェースを実装）
```

## ファイル命名規則

ファイル名は `kebab-case` + サフィックスで役割を明示：

| サフィックス       | 役割                                 |
| ------------------ | ------------------------------------ |
| `.handler.ts`      | APIハンドラー                        |
| `.schema.ts`       | バリデーションスキーマ・ルート定義   |
| `.entity.ts`       | エンティティ                         |
| `.value.ts`        | 値オブジェクト                       |
| `.factory.ts`      | ファクトリー                         |
| `.repository.ts`   | リポジトリ実装                       |
| `.error.ts`        | エラークラス                         |
| `.test.ts`         | 単体テスト・インテグレーションテスト |
| `.e2e.ts`          | E2Eテスト                            |
| `.test-factory.ts` | テスト用ファクトリー                 |

## 設計パターン

### 1. スキーマ・ハンドラー分離パターン

APIルートではスキーマ定義とビジネスロジック呼び出しを分離する。

- `.schema.ts`: Zodスキーマ、型定義、OpenAPIルート定義
- `.handler.ts`: Application層の呼び出し、レスポンス整形

### 2. リポジトリパターン

- インターフェースは domains 層に定義
- 実装は db 層に配置
- 依存性注入でテスタビリティを確保

### 3. ファクトリーパターン

エンティティ・値オブジェクトの生成はファクトリー経由で行う。

- 新規作成時のデフォルト値設定
- バリデーション済みオブジェクトの生成保証

### 4. 値オブジェクトパターン

- 不変（イミュータブル）
- 生成時にZodでバリデーション
- getterで値を公開

### 5. エラーハンドリングパターン

3種類のエラー抽象クラスを使い分ける：

| 抽象クラス | 用途 | 配置場所 |
|------------|------|----------|
| `DomainErrorAbstract` | ドメイン層のビジネスエラー | `domains/{domain}/errors/` |
| `DbErrorAbstract` | DB層のエラー | `db/repositories/{domain}/` |
| `ApiError` | API層のエラー（認証等） | `api/lib/errors/` |

#### message / code / statusCode の役割

| 項目 | 役割 | 対象 |
|------|------|------|
| `message` | エンドユーザーに表示可能なメッセージ | ユーザー |
| `code` | フロントエンド開発者が内部処理を判断するためのコード | FE開発者 |
| `statusCode` | HTTPステータスコード | システム |

**使い分けの例**: 同じ404でも `USER_NOT_FOUND` と `USER_DEACTIVE` では処理が異なる場合がある。FE側で処理を分岐させたい時に `code` を使って判断する。

#### エラーコードの命名規則

- `ErrorCode` enumは `shared/error-code.const.ts` で定義
- バックエンド・フロントエンドで共有
- **キー名のprefixはドメイン名にする**（例: `USER_NOT_FOUND`, `TOKEN_EXPIRED`）
- 必要に応じて追加可能

#### codeを明記するタイミング

- `ApiError`: 常に `code` を持つ（必須）
- `DomainError` / `DbError`: 通常は `undefined`（ERROR_STATUS_MAPで設定）
  - 例外: リクエストクライアント側に内部処理的なエラーを伝えたい時は明記可能

#### エラー→HTTPステータス変換

- `DomainError` / `DbError` は `ERROR_STATUS_MAP` でステータスコードに変換
- `ApiError` は自身で `statusCode` を持つ
- マッピングは `api/lib/errors/error-status.helper.ts` に定義

## テスト規約

- describe/it パターン
- テスト名は日本語で記述
- beforeEach でDBクリーンアップ
- テスト用ファクトリーを活用
- 正常系・異常系を網羅

### テストデータの準備

- テストでデータを準備する場合は `TestRepository` を使用する
- プロダクションコード（Application層やRepository実装）をテスト準備に使わない
- `TestRepository` は `db/repositories/test/test.repository.ts` に配置

### テスト用ヘルパー関数

- テスト用のヘルパー関数は `db/lib/helpers/database.test-helper.ts` に記述
- `cleanupAllTables()` などの共通処理をここに集約

## コードスタイル

- クラス名・型名: `PascalCase`
- ファイル名: `kebab-case`
- コメント: 日本語
- セミコロン: あり
- クォート: シングルクォート
- インデント: スペース2つ
- 1行の最大文字数: 80

---

**プロジェクト固有の詳細（技術スタック、コマンド、具体例）は `docs/PROJECT_RULES.md` を参照してください。**
