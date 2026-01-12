import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { ErrorCode } from '@shared/error-code.const';

describe('POST /api/users/me - E2E', () => {
  const testPassword = 'password123';
  const testEmail = 'me-e2e-test@example.com';
  const testName = 'テストユーザー';

  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('認証済みユーザーが自分の情報を取得できる', async () => {
    // DBにユーザーを作成
    const createdUser = await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    // ログインしてアクセストークンを取得
    const loginRes = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(loginRes.status).toBe(200);
    const loginBody = await loginRes.json();
    const accessToken = loginBody.accessToken;

    // アクセストークンを使ってme APIを呼び出す
    const res = await app.request('/api/users/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        accessToken: accessToken,
      }),
    });

    // ステータスコード200を確認
    expect(res.status).toBe(200);

    // レスポンスボディを検証
    const body = await res.json();
    expect(body.id).toBe(createdUser.values.id);
    expect(body.email).toBe(testEmail);
    expect(body.name).toBe(testName);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });

  it('トークンなしでme APIを呼び出すと401エラー', async () => {
    // トークンなしでme APIを呼び出す
    const res = await app.request('/api/users/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: '',
      }),
    });

    // ステータスコード401を確認
    expect(res.status).toBe(401);

    // エラーレスポンスの内容を確認
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.TOKEN_NOT_FOUND);
  });

  it('無効なトークンでme APIを呼び出すと401エラー', async () => {
    // 無効なトークンでme APIを呼び出す
    const res = await app.request('/api/users/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid-token-12345',
      },
      body: JSON.stringify({
        accessToken: 'invalid-token-12345',
      }),
    });

    // ステータスコード401を確認
    expect(res.status).toBe(401);

    // エラーレスポンスの内容を確認
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.TOKEN_INVALID);
  });
});
