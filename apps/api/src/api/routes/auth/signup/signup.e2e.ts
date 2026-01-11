import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import { testRepository } from '@db/repositories/test/test.repository';

describe('POST /api/auth/signup - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  const validSignupRequest = {
    name: 'テストユーザー',
    email: 'signup-test@example.com',
    password: 'password123',
  };

  it('新規ユーザーをサインアップできる', async () => {
    // POSTリクエストを送信
    const res = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validSignupRequest),
    });

    // ステータスコード200を確認
    expect(res.status).toBe(200);

    // レスポンスボディを検証
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe(validSignupRequest.name);
    expect(body.email).toBe(validSignupRequest.email);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();

    // DBにユーザーが作成されていることを確認
    const userInDb = await testRepository.findUserByEmail(
      validSignupRequest.email
    );
    expect(userInDb).toBeDefined();
    expect(userInDb?.id).toBe(body.id);
    expect(userInDb?.name).toBe(validSignupRequest.name);
    expect(userInDb?.email).toBe(validSignupRequest.email);
  });

  it('同じメールアドレスで2回サインアップすると409エラー', async () => {
    // 1回目のsignupは成功
    const firstRes = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validSignupRequest),
    });
    expect(firstRes.status).toBe(200);

    // 2回目のsignupは409エラー
    const secondRes = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '別のユーザー',
        email: validSignupRequest.email, // 同じメールアドレス
        password: 'differentPassword123',
      }),
    });
    expect(secondRes.status).toBe(409);

    // エラーレスポンスの内容を確認
    const errorBody = await secondRes.json();
    expect(errorBody.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });
});
