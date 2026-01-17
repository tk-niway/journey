import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';

describe('GET /api/notes - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('ノート一覧を取得できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken, {
      title: 'テストタイトル',
      content: 'テスト本文',
      tags: ['タグ1'],
    });

    const res = await app.request('/api/notes', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBe(1);
    expect(body[0].id).toBe(created.id);
  });
});
