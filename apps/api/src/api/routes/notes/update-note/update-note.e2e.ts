import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';

describe('PATCH /api/notes/:id - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('ノートを更新できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken);

    const res = await app.request(`/api/notes/${created.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: '更新タイトル',
        content: '更新本文',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('更新タイトル');
    expect(body.content).toBe('更新本文');
  });
});
