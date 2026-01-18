import app from '@api/index';
import { expect } from 'vitest';
import { createTestUser } from '@db/lib/helpers/database.test-helper';

export const createUserAndToken = async (options?: {
  email?: string;
  password?: string;
  name?: string;
}) => {
  const email =
    options?.email ?? `note-e2e-${Date.now()}-${Math.random()}@example.com`;
  const password = options?.password ?? 'password123';
  const name = options?.name ?? 'テストユーザー';

  const user = await createTestUser({ email, password, name });
  const loginRes = await app.request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  expect(loginRes.status).toBe(200);
  const loginBody = await loginRes.json();
  return { user, accessToken: loginBody.accessToken as string };
};

export const createNote = async (
  accessToken: string,
  body?: Partial<{
    title: string;
    content: string;
    tags: string[];
  }>
) => {
  const res = await app.request('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: body?.title ?? 'タイトル',
      content: body?.content ?? '本文',
      tags: body?.tags,
    }),
  });

  expect(res.status).toBe(200);
  return res.json();
};
