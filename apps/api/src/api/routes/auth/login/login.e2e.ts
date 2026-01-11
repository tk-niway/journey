import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';

describe('POST /api/auth/login - E2E', () => {
  const testPassword = 'password123';
  const testEmail = 'login-e2e-test@example.com';
  const testName = 'テストユーザー';

  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('登録済みユーザーがログインできる', async () => {
    // DBにユーザーを作成
    const createdUser = await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

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
    expect(body.user.name).toBe(testName);
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
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

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
