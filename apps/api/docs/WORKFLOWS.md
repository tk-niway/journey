# 作業パターン

このドキュメントは、よくある開発作業の手順をまとめたものです。

## 新しいAPIエンドポイントを追加する

### 1. スキーマファイルを作成

`src/api/routes/{feature}/{action}.schema.ts`

```typescript
import { createRoute, z } from '@hono/zod-openapi';

// リクエストスキーマ
const someRequest = z.object({
  // プロパティ定義
});

type SomeRequest = z.infer<typeof someRequest>;

// レスポンススキーマ
const someResponse = z.object({
  // プロパティ定義
});

// ルート定義
const someRoute = createRoute({
  path: '/path',
  method: 'post', // get, post, put, delete, patch
  request: {
    body: {
      content: { 'application/json': { schema: someRequest } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: someResponse } },
      description: '成功時の説明',
    },
  },
});

export { someRoute, SomeRequest };
```

### 2. ハンドラーファイルを作成

`src/api/routes/{feature}/{action}.handler.ts`

```typescript
import { SomeRequest } from './{action}.schema';
import { SomeApplication } from '@applications/{domain}/{domain}.application';

export const someHandler = async (params: SomeRequest) => {
  const application = new SomeApplication();
  const result = await application.someMethod(params);
  return result.values;
};
```

### 3. ルートを登録

`src/api/routes/{feature}/index.ts`

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { someRoute } from './{action}/{action}.schema';
import { someHandler } from './{action}/{action}.handler';

const app = new OpenAPIHono();

app.openapi(someRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await someHandler(body);
  return c.json(result);
});

export default app;
```

### 4. E2Eテストを作成

`src/api/routes/{feature}/{action}.e2e.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';

describe('{action} E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('正常系のテスト', async () => {
    // テスト実装
  });
});
```

---

## 新しいドメインを追加する

### 1. 値オブジェクトを作成

`src/domains/{domain}/values/{domain}.value.ts`

```typescript
import { z } from 'zod';

export interface SomeValueObject {
  id: string;
  // その他のプロパティ
  createdAt: Date;
  updatedAt: Date;
}

export class SomeValue {
  constructor(values: SomeValueObject) {
    this._values = this.validate(values);
  }

  private _values: SomeValueObject;

  private validate(values: SomeValueObject): SomeValueObject {
    return z
      .object({
        id: z.string().min(1),
        // その他のバリデーション
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .strip()
      .parse(values);
  }

  get values(): SomeValueObject {
    return this._values;
  }
}
```

### 2. エンティティを作成

`src/domains/{domain}/entities/{domain}.entity.ts`

```typescript
import { SomeValue, SomeValueObject } from '../values/{domain}.value';

export class SomeEntity {
  constructor(values: SomeValue) {
    this._values = values;
  }

  private _values: SomeValue;

  get values(): SomeValueObject {
    return this._values.values;
  }

  // ビジネスロジックメソッド
}
```

### 3. ファクトリーを作成

`src/domains/{domain}/factories/{domain}.factory.ts`

```typescript
import { SomeEntity } from '../entities/{domain}.entity';
import { SomeValue, SomeValueObject } from '../values/{domain}.value';
import { nanoid } from 'nanoid';

export class SomeFactory {
  private constructor() {}

  static createValue(values: SomeValueObject): SomeValue {
    return new SomeValue(values);
  }

  static createNewValue(values: Partial<SomeValueObject>): SomeValue {
    const id = values.id || nanoid();
    const now = new Date();
    return new SomeValue({
      id,
      // デフォルト値の設定
      createdAt: values.createdAt || now,
      updatedAt: values.updatedAt || now,
      ...values,
    });
  }

  static createEntity(values: SomeValueObject): SomeEntity {
    return new SomeEntity(this.createValue(values));
  }
}
```

### 4. エラーを作成

`src/domains/{domain}/errors/{domain}.error.ts`

```typescript
import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';

export class SomeNotFoundError extends DomainErrorAbstract {
  public code: string = 'SOME_NOT_FOUND';
  constructor(id: string) {
    super(`見つかりませんでした id:${id}`);
    this.name = this.constructor.name;
  }
}
```

### 5. リポジトリインターフェースを作成

`src/domains/{domain}/repositories/{domain}-repository.interface.ts`

```typescript
import { SomeEntity } from '../entities/{domain}.entity';

export interface SomeRepository {
  findById(id: string): Promise<SomeEntity | null>;
  create(entity: SomeEntity): Promise<SomeEntity>;
  update(entity: SomeEntity): Promise<SomeEntity>;
  delete(id: string): Promise<void>;
}
```

### 6. テーブルスキーマを作成

`src/db/schemas/{domain}-table.schema.ts`

```typescript
import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const someTable = sqliteTable('some_table', {
  id: text().primaryKey().notNull(),
  // その他のカラム
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});
```

### 7. リポジトリ実装を作成

`src/db/repositories/{domain}/{domain}-table.repository.ts`

```typescript
import { SomeEntity } from '@domains/{domain}/entities/{domain}.entity';
import { SomeRepository } from '@domains/{domain}/repositories/{domain}-repository.interface';
import { SomeFactory } from '@domains/{domain}/factories/{domain}.factory';
import { someTable } from '@db/schemas/{domain}-table.schema';
import { DatabaseService } from '@db/database.service';
import { eq } from 'drizzle-orm';

export class SomeTableRepository implements SomeRepository {
  constructor(private readonly dbClient: DatabaseService) {}

  async findById(id: string) {
    const result = await this.dbClient.query.someTable.findFirst({
      where: eq(someTable.id, id),
    });
    return result ? SomeFactory.createEntity(result) : null;
  }

  async create(entity: SomeEntity): Promise<SomeEntity> {
    const [created] = await this.dbClient
      .insert(someTable)
      .values(entity.values)
      .returning()
      .all();
    return SomeFactory.createEntity(created);
  }
}
```

### 8. マイグレーションを生成

```bash
pnpm drizzle-kit generate
```

---

## バグを修正する

### 1. 失敗するテストを書く

まず、バグを再現するテストを作成する：

```typescript
it('バグの説明：期待する動作', async () => {
  // バグを再現する入力
  const input = {
    /* ... */
  };

  // 期待する結果（現在は失敗する）
  const result = await someFunction(input);
  expect(result).toBe(expectedValue);
});
```

### 2. テストが失敗することを確認

```bash
pnpm test src/path/to/file.test.ts
```

### 3. 修正を実装

該当のコードを修正する。

### 4. テストが通ることを確認

```bash
pnpm test src/path/to/file.test.ts
```

### 5. 関連するテストを実行

```bash
pnpm test
```

---

## リファクタリングする

### 1. 既存のテストがすべて通ることを確認

```bash
pnpm test
```

### 2. リファクタリングを実施

コードを改善する。ただし、外部から見た動作は変更しない。

### 3. テストが通ることを再確認

```bash
pnpm test
```

### 4. 必要に応じてテストも更新

新しいパターンに合わせてテストコードも改善する。

---

## DBマイグレーションを追加する

### 1. スキーマファイルを編集

`src/db/schemas/{domain}-table.schema.ts` を編集して、カラム追加やテーブル追加を行う。

### 2. マイグレーションを生成

```bash
pnpm drizzle-kit generate
```

### 3. 生成されたマイグレーションを確認

`drizzle/` ディレクトリに新しいSQLファイルが生成される。内容を確認する。

### 4. マイグレーションを適用

```bash
pnpm drizzle-kit migrate
```

### 5. DBの状態を確認

```bash
pnpm drizzle-kit status
```

---

## 新しい共有スキーマを追加する

APIレスポンスで共通して使うスキーマを追加する場合：

### 1. スキーマファイルを作成

`src/api/lib/schemas/{domain}/{domain}-object.schema.ts`

```typescript
import { z } from 'zod';

export const someObjectSchema = z.object({
  id: z.string(),
  // その他のプロパティ
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### 2. 各ルートのスキーマからインポートして使用

```typescript
import { someObjectSchema } from '@api/lib/schemas/{domain}/{domain}-object.schema';

const responseSchema = z.object({
  data: someObjectSchema,
});
```

---

## 作業完了チェックリスト

すべての作業が完了したら、以下のチェックを実行してください：

### 1. テストの実行

```bash
pnpm test
```

すべてのテストがパスすることを確認。

### 2. Lintチェック

```bash
pnpm lint:check
```

エラーがないことを確認。エラーがある場合：

```bash
pnpm lint:fix
```

### 3. フォーマットチェック

```bash
pnpm format:check
```

エラーがないことを確認。エラーがある場合：

```bash
pnpm format:fix
```

### 一括チェック

上記を一括で実行：

```bash
pnpm check:all
```

### チェック項目まとめ

| チェック     | コマンド            | 自動修正          |
| ------------ | ------------------- | ----------------- |
| テスト       | `pnpm test`         | -                 |
| Lint         | `pnpm lint:check`   | `pnpm lint:fix`   |
| フォーマット | `pnpm format:check` | `pnpm format:fix` |
| 型チェック   | `pnpm type:check`   | -                 |
| 全チェック   | `pnpm check:all`    | -                 |
