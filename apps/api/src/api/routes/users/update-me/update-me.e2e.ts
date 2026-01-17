import { describe, it, expect, beforeEach } from 'vitest';
import app from '@api/index';
import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { ErrorCode } from '@shared/error-code.const';

describe('PATCH /api/users/me - E2E', () => {
  const testPassword = 'password123';
  const testEmail = 'update-me-e2e-test@example.com';
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

  it('名前を更新できる', async () => {
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: '更新後ユーザー' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('更新後ユーザー');
    expect(body.email).toBe(testEmail);
  });

  it('メールアドレスが重複すると409エラー', async () => {
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    await createTestUser({
      email: 'duplicate@example.com',
      password: testPassword,
      name: '別ユーザー',
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email: 'duplicate@example.com' }),
    });

    expect(res.status).toBe(409);
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
  });

  it('現在のパスワードが間違っていると401エラー', async () => {
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword: 'wrongPassword123',
        newPassword: 'newPassword123',
      }),
    });

    expect(res.status).toBe(401);
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.USER_INVALID_PASSWORD);
  });

  it('パスワードを更新できる', async () => {
    await createTestUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    const accessToken = await loginAndGetToken(testEmail, testPassword);

    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword: testPassword,
        newPassword: 'newPassword123',
      }),
    });

    expect(res.status).toBe(200);

    const loginRes = await app.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'newPassword123',
      }),
    });

    expect(loginRes.status).toBe(200);
  });
});
