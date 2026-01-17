import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { ErrorCode } from '@shared/error-code.const';

describe('GET /api/users/:id - E2E', () => {
  const testPassword = 'password123';
  const testEmail = 'fetch-user-e2e@example.com';
  const testName = 'テストユーザー';

  beforeEach(async () => {
    await cleanupAllTables();
  });

  const loginAndGetToken = async (email: string, password: string) => {
    const loginRes = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const loginBody = await loginRes.json();
    return loginBody.accessToken as string;
  };

  it('認証済みユーザーがユーザー詳細を取得できる', async () => {
    const createdUser = await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request(`/api/users/${createdUser.values.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(createdUser.values.id);
    expect(body.email).toBe(testEmail);
    expect(body.name).toBe(testName);
  });

  it('存在しないユーザーIDの場合は404エラー', async () => {
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request('/api/users/non-existent-id', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(404);
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.USER_NOT_FOUND);
  });
});
