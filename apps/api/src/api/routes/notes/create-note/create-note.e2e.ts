import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import { createUserAndToken } from '@api/routes/notes/note-test.helper';

describe('POST /api/notes - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('ノートを作成できる', async () => {
    const { accessToken } = await createUserAndToken();
    const res = await app.request('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: 'テストタイトル',
        content: 'テスト本文',
        tags: ['タグ1'],
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('テストタイトル');
    expect(body.content).toBe('テスト本文');
    expect(body.tags[0].name).toBe('タグ1');
  });
});
