import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import { databaseService } from '@db/database.service';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';

describe('POST /api/auth/login - E2E', () => {
  const testPassword = 'password123';
  const testEmail = 'login-e2e-test@example.com';

  beforeEach(async () => {
    await cleanupAllTables();
  });

  // テスト用ユーザーをDBに作成するヘルパー関数
  const createTestUser = async (email: string, password: string) => {
    const userEntity = UserTestFactory.createUserEntity(
      { email, name: 'テストユーザー' },
      { plainPassword: password }
    );
    await databaseService.insert(usersTable).values({
      ...userEntity.values,
    });
    await databaseService.insert(userCredentialsTable).values({
      ...userEntity.credential,
    });
    return userEntity;
  };

  it('登録済みユーザーがログインできる', async () => {
    // DBにユーザーを作成
    const createdUser = await createTestUser(testEmail, testPassword);

    // POSTリクエストを送信
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    // ステータスコード200を確認
    expect(res.status).toBe(200);

    // レスポンスボディを検証
    const body = await res.json();
    expect(body.accessToken).toBeDefined();
    expect(body.user).toBeDefined();
    expect(body.user.id).toBe(createdUser.values.id);
    expect(body.user.email).toBe(testEmail);
    expect(body.user.name).toBe('テストユーザー');
  });

  it('存在しないメールアドレスでログインすると404エラー', async () => {
    // DBにユーザーがいない状態でloginリクエストを送信
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: testPassword,
      }),
    });

    // ステータスコード404を確認
    expect(res.status).toBe(404);

    // エラーレスポンスの内容を確認
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe('USER_NOT_FOUND');
  });

  it('パスワードが間違っている場合401エラー', async () => {
    // DBにユーザーを作成
    await createTestUser(testEmail, testPassword);

    // 間違ったパスワードでloginリクエストを送信
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongPassword123',
      }),
    });

    // ステータスコード401を確認
    expect(res.status).toBe(401);

    // エラーレスポンスの内容を確認
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe('INVALID_PASSWORD');
  });
});
