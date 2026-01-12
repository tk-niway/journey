# Journey API プロジェクト固有ルール

このドキュメントは AGENTS.md の概念をこのプロジェクトに適用した具体例です。

## 技術スタック

| カテゴリ             | 技術                     |
| -------------------- | ------------------------ |
| フレームワーク       | Hono + @hono/zod-openapi |
| ORM                  | Drizzle ORM (SQLite)     |
| バリデーション       | Zod                      |
| テスト               | Vitest                   |
| 言語                 | TypeScript               |
| パッケージマネージャ | pnpm                     |

## コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# テスト実行
pnpm test

# 単一テストファイル実行
pnpm test src/path/to/file.test.ts

# リント
pnpm lint

# フォーマット
pnpm format

# DBマイグレーション生成
pnpm drizzle-kit generate

# DBマイグレーション適用
pnpm drizzle-kit migrate

# DBの状態確認
pnpm drizzle-kit status
```

## パスエイリアス

tsconfig.jsonで定義済み：

```typescript
import { Something } from '@api/...';
import { Something } from '@applications/...';
import { Something } from '@domains/...';
import { Something } from '@db/...';
import { Something } from '@lib/...';
```

## 具体的な実装例

### APIルート定義

スキーマとハンドラーを分離：

```typescript
// {action}.schema.ts
import { createRoute, z } from '@hono/zod-openapi';

const loginRequest = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginRequest = z.infer<typeof loginRequest>;

const loginResponse = z.object({
  accessToken: z.string(),
  user: userObjectSchema,
});

const loginRoute = createRoute({
  path: '/login',
  method: 'post',
  request: {
    body: {
      content: { 'application/json': { schema: loginRequest } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: loginResponse } },
      description: 'Login successful',
    },
  },
});

export { loginRoute, LoginRequest };
```

```typescript
// {action}.handler.ts
import { LoginRequest } from './login.schema';
import { AuthApplication } from '@applications/auth/auth.application';

export const loginHandler = async (params: LoginRequest) => {
  const authApplication = new AuthApplication();
  const user = await authApplication.login(params.email, params.password);
  return user.values;
};
```

```typescript
// index.ts（ルート登録）
import { OpenAPIHono } from '@hono/zod-openapi';
import { loginRoute } from './login/login.schema';
import { loginHandler } from './login/login.handler';

const app = new OpenAPIHono();

app.openapi(loginRoute, async (c) => {
  const body = c.req.valid('json');
  const user = await loginHandler(body);
  const accessToken = await createAccessToken(c, user.id);
  return c.json({ accessToken, user });
});

export default app;
```

### エラーハンドリング

エラーは3種類の抽象クラスを使い分ける。

#### message / code / statusCode の役割

| 項目         | 役割                                                 | 対象     |
| ------------ | ---------------------------------------------------- | -------- |
| `message`    | エンドユーザーに表示可能なメッセージ                 | ユーザー |
| `code`       | フロントエンド開発者が内部処理を判断するためのコード | FE開発者 |
| `statusCode` | HTTPステータスコード                                 | システム |

**使い分けの例**: 同じ404でも `USER_NOT_FOUND` と `USER_DEACTIVE` では処理が異なる場合がある。FE側で処理を分岐させたい時に `code` を使って判断する。

#### エラーコード定義

- 定義場所: `shared/error-code.const.ts`
- バックエンド・フロントエンドで共有
- **キー名のprefixはドメイン名にする**（例: `USER_NOT_FOUND`, `TOKEN_EXPIRED`）
- 必要に応じて追加可能

具体的な値は `shared/error-code.const.ts` を参照してください。

#### ドメインエラー（domains/{domain}/errors/）

- `message`: エンドユーザーに読まれても良い内容にする
- `code`: 通常は `undefined`（ERROR_STATUS_MAPで設定）
  - 例外: リクエストクライアント側に内部処理的なエラーを伝えたい時は明記可能

```typescript
import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';

export class UserNotFoundError extends DomainErrorAbstract {
  code = undefined; // ERROR_STATUS_MAPで設定
  constructor(email: string) {
    // messageはエンドユーザーに表示可能な内容にする
    super(`ユーザーが見つかりませんでした`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends DomainErrorAbstract {
  code = undefined;
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています`);
    this.name = this.constructor.name;
  }
}
```

#### DBエラー（db/repositories/{domain}/）

```typescript
import { DbErrorAbstract } from '@lib/errors/db-error.abstract';

export class UserCreateDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(`ユーザー作成に失敗しました`);
    this.name = this.constructor.name;
  }
}
```

#### API層エラー（api/lib/errors/）

API層で直接throwするエラー（認証等）：

```typescript
import { ApiError } from '@lib/errors/api-error.abstract';
import { ErrorCode } from '@shared/error-code.const';
import { ContentfulStatusCode } from '@lib/errors/http-status.const';

export class InvalidTokenApiError extends ApiError {
  public code: ErrorCode = ErrorCode.TOKEN_INVALID;
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class UserNotFoundApiError extends ApiError {
  public code: ErrorCode = ErrorCode.USER_NOT_FOUND;
  public statusCode: ContentfulStatusCode = 404;
  constructor(userId: string) {
    super(`ユーザーが見つかりませんでした id:${userId}`);
    this.name = this.constructor.name;
  }
}
```

#### エラー→ステータスマッピング（api/lib/errors/error-status.helper.ts）

DomainError/DbErrorをHTTPステータスに変換：

```typescript
import { ErrorCode } from '@shared/error-code.const';
import { ContentfulStatusCode } from '@lib/errors/http-status.const';

export const ERROR_STATUS_MAP = new Map<
  string,
  { code: ErrorCode; statusCode: ContentfulStatusCode }
>([
  [UserNotFoundError.name, { code: ErrorCode.USER_NOT_FOUND, statusCode: 404 }],
  [
    EmailAlreadyExistsError.name,
    { code: ErrorCode.USER_EMAIL_ALREADY_EXISTS, statusCode: 409 },
  ],
  [
    InvalidPasswordError.name,
    { code: ErrorCode.USER_INVALID_PASSWORD, statusCode: 401 },
  ],
  [
    UserCreateDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
]);
```

#### グローバルエラーハンドラー（api/middlewares/error.middleware.ts）

```typescript
export const errorHandler = (err: Error, c: Context) => {
  // ApiErrorはそのまま返却
  if (err instanceof ApiError) {
    return c.json(createErrorResponse(err.message, err.code), err.statusCode);
  }

  // DomainError/DbErrorはマッピングで変換
  if (err instanceof DomainErrorAbstract || err instanceof DbErrorAbstract) {
    const status = ERROR_STATUS_MAP.get(err.constructor.name);
    const statusCode = status?.statusCode || 500;
    // エラークラスにcodeが明記されていればそれを優先、なければマッピングのcode
    const code = err?.code || status?.code || ErrorCode.INTERNAL_SERVER_ERROR;
    return c.json(createErrorResponse(err.message, code), statusCode);
  }

  // その他は500
  return c.json(
    createErrorResponse(
      'Internal Server Error',
      ErrorCode.INTERNAL_SERVER_ERROR
    ),
    500
  );
};
```

### 値オブジェクト

```typescript
import { z } from 'zod';

export interface UserValueObject {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserValueArgs = UserValueObject;

export class UserValue {
  constructor(values: UserValueArgs) {
    this._values = this.valueValidator(values);
  }

  private _values: UserValueObject;

  private valueValidator(values: UserValueArgs): UserValueObject {
    return z
      .object({
        id: z.string().min(1, 'Id is required'),
        name: z.string().min(1, 'Name is required'),
        email: z.email('Invalid email'),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .strip()
      .parse(values);
  }

  get values(): UserValueObject {
    return this._values;
  }
}
```

### リポジトリインターフェース

```typescript
// domains/user/repositories/user-repository.interface.ts
import { UserEntity } from '@domains/user/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userEntity: UserEntity): Promise<UserEntity>;
}
```

### リポジトリ実装

```typescript
// db/repositories/users/users-table.repository.ts
import { UserEntity } from '@domains/user/entities/user.entity';
import { usersTable } from '@db/schemas/users-table.schema';
import { UserFactory } from '@domains/user/factories/user.factory';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '@db/database.service';
import { UserRepository } from '@domains/user/repositories/user-repository.interface';

export class UsersTableRepository implements UserRepository {
  constructor(private readonly dbClient: DatabaseService) {}

  async findById(id: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
      with: {
        userCredentials: true,
      },
    });
    return user
      ? UserFactory.createUserEntity(user, user.userCredentials)
      : null;
  }

  async findByEmail(email: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
      with: {
        userCredentials: true,
      },
    });
    return user
      ? UserFactory.createUserEntity(user, user.userCredentials)
      : null;
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const userArgs = userEntity.createUserArgs();
    const credentialArgs = userEntity.createUserCredentialArgs();

    return this.dbClient.transaction((db) => {
      const createUserResult = db
        .insert(usersTable)
        .values(userArgs)
        .returning()
        .all();

      const createdUser = createUserResult[0];
      if (!createdUser) throw new UserCreateDbError();

      const createCredentialResult = db
        .insert(userCredentialsTable)
        .values(credentialArgs)
        .returning()
        .all();

      const createdCredential = createCredentialResult[0];
      if (!createdCredential) throw new UserCredentialCreateDbError();

      return UserFactory.createUserEntity(createdUser, createdCredential);
    });
  }
}
```

### アプリケーション層

```typescript
import { databaseService, DatabaseService } from '@db/database.service';
import { UserFactory } from '@domains/user/factories/user.factory';
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
} from '@domains/user/errors/user.error';
import { UserRepository } from '@domains/user/repositories/user-repository.interface';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';

export class AuthApplication {
  constructor(dbService: DatabaseService = databaseService) {
    this.userRepository = new UsersTableRepository(dbService);
  }

  private userRepository: UserRepository;

  async signup(input: { name: string; email: string; password: string }) {
    const newUserValue = UserFactory.createNewUserValue(input);
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) throw new EmailAlreadyExistsError(input.email);

    const credentialValue = UserFactory.createNewUserCredentialValue({
      userId: newUserValue.values.id,
      plainPassword: input.password,
    });
    const newUserEntity = UserFactory.createUserEntity(
      newUserValue,
      credentialValue
    );
    return this.userRepository.create(newUserEntity);
  }

  async login(email: string, password: string) {
    const userEntity = await this.userRepository.findByEmail(email);
    if (!userEntity) throw new UserNotFoundError(email);
    if (!userEntity.verifyPassword(password)) throw new InvalidPasswordError();
    return userEntity;
  }
}
```

### テスト

```typescript
import { AuthApplication } from './auth.application';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
} from '@domains/user/errors/user.error';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '@db/repositories/test/test.repository';

describe('AuthApplication', () => {
  let authApplication: AuthApplication;

  beforeEach(async () => {
    await cleanupAllTables();
    authApplication = new AuthApplication();
  });

  describe('signup', () => {
    const validInput = {
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
    };

    it('新規ユーザーをサインアップしてDBに登録できる', async () => {
      const result = await authApplication.signup(validInput);

      expect(result).toBeDefined();
      expect(result.values.name).toBe(validInput.name);
      expect(result.values.email).toBe(validInput.email);

      const userInDb = await testRepository.findUserByEmail(validInput.email);
      expect(userInDb).toBeDefined();
      expect(userInDb?.id).toBe(result.values.id);
    });

    it('同じメールアドレスで2回サインアップするとEmailAlreadyExistsErrorをスロー', async () => {
      await authApplication.signup(validInput);

      const duplicateInput = {
        name: '別のユーザー',
        email: validInput.email,
        password: 'differentPassword',
      };

      await expect(authApplication.signup(duplicateInput)).rejects.toThrow(
        EmailAlreadyExistsError
      );
    });
  });

  describe('login', () => {
    it('登録済みユーザーが正しいパスワードでログインできる', async () => {
      const testPassword = 'password123';
      const testEmail = 'test@example.com';

      const userEntity = UserTestFactory.createUserEntity(
        { email: testEmail },
        { plainPassword: testPassword }
      );
      await testRepository.createUser(userEntity);

      const result = await authApplication.login(testEmail, testPassword);

      expect(result).toBeDefined();
      expect(result.values.email).toBe(testEmail);
    });

    it('存在しないメールアドレスでログインするとUserNotFoundErrorをスロー', async () => {
      await expect(
        authApplication.login('nonexistent@example.com', 'anyPassword')
      ).rejects.toThrow(UserNotFoundError);
    });

    it('パスワードが間違っている場合InvalidPasswordErrorをスロー', async () => {
      const testEmail = 'test@example.com';
      const userEntity = UserTestFactory.createUserEntity(
        { email: testEmail },
        { plainPassword: 'password123' }
      );
      await testRepository.createUser(userEntity);

      await expect(
        authApplication.login(testEmail, 'wrongPassword')
      ).rejects.toThrow(InvalidPasswordError);
    });
  });
});
```

### TestRepository（テストデータ準備用）

テストでデータを準備する場合は、プロダクションコード（Application層やRepository実装）を使わず、`TestRepository` を使用する。

```typescript
// db/repositories/test/test.repository.ts
import { DatabaseService, databaseService } from '@db/database.service';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { UserEntity } from '@domains/user/entities/user.entity';
import { eq } from 'drizzle-orm';

/**
 * テスト用のDB操作をまとめたリポジトリ
 * テストコードでのみ使用する
 */
export class TestRepository {
  constructor(private readonly dbClient: DatabaseService = databaseService) {}

  /**
   * テスト用ユーザーをDBに作成する
   */
  async createUser(userEntity: UserEntity): Promise<void> {
    await this.dbClient.insert(usersTable).values({
      ...userEntity.values,
    });
    await this.dbClient.insert(userCredentialsTable).values({
      ...userEntity.credential,
    });
  }

  /**
   * メールアドレスでユーザーを検索する
   */
  async findUserByEmail(email: string) {
    return this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }
}

// シングルトンインスタンス
export const testRepository = new TestRepository();
```

### テスト用ヘルパー関数

テスト用のヘルパー関数は `db/lib/helpers/database.test-helper.ts` に記述する。

```typescript
// db/lib/helpers/database.test-helper.ts
import { databaseService } from '@db/database.service';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { sql } from 'drizzle-orm';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '@db/repositories/test/test.repository';
import { UserEntity } from '@domains/user/entities/user.entity';
import { faker } from '@faker-js/faker';

// 全テーブルのリスト（新しいテーブルを追加したらここに追加）
const allTables = [userCredentialsTable, usersTable];

/**
 * テスト用にデータベースの全テーブルをクリーンアップする
 */
export const cleanupAllTables = async () => {
  databaseService.run(sql`PRAGMA foreign_keys = OFF`);
  for (const table of allTables) {
    await databaseService.delete(table);
  }
  databaseService.run(sql`PRAGMA foreign_keys = ON`);
};

/**
 * テスト用ユーザーをDBに作成するヘルパー関数
 */
export const createTestUser = async (args: {
  email: string;
  password: string;
  name?: string;
}): Promise<UserEntity> => {
  const userEntity = UserTestFactory.createUserEntity(
    { email: args.email, name: args.name ?? faker.person.fullName() },
    { plainPassword: args.password }
  );
  await testRepository.createUser(userEntity);
  return userEntity;
};
```

### Drizzle テーブルスキーマ

```typescript
import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text().primaryKey().notNull(),
  name: text({ length: 128 }).notNull(),
  email: text({ length: 128 }).notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const usersTableRelations = relations(usersTable, ({ one }) => ({
  userCredentials: one(userCredentialsTable, {
    fields: [usersTable.id],
    references: [userCredentialsTable.userId],
  }),
}));
```

## セキュリティ考慮事項

- パスワードはハッシュ化して保存（UserCredentialValue内でbcryptを使用）
- 認証トークンはmiddlewareで検証
- ユーザー入力はZodスキーマで必ずバリデーション
- SQLインジェクション対策はDrizzle ORMが担保
