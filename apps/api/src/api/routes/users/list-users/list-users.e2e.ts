import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { ErrorCode } from '@shared/error-code.const';

describe('GET /api/users - E2E', () => {
  const testPassword = 'password123';

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

  it('認証済みユーザーが一覧を取得できる', async () => {
    await createTestUser({
      email: 'list-users-1@example.com',
      password: testPassword,
      name: 'ユーザー1',
    });

    await createTestUser({
      email: 'list-users-2@example.com',
      password: testPassword,
      name: 'ユーザー2',
    });

    const accessToken = await loginAndGetToken(
      'list-users-1@example.com',
      testPassword
    );

    const res = await app.request('/api/users?limit=10&offset=0', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const emails = body.users.map((user: { email: string }) => user.email);
    expect(emails).toContain('list-users-1@example.com');
    expect(emails).toContain('list-users-2@example.com');
  });

  it('トークンなしで一覧を取得すると401エラー', async () => {
    const res = await app.request('/api/users', {
      method: 'GET',
    });

    expect(res.status).toBe(401);
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.TOKEN_NOT_FOUND);
  });
});
