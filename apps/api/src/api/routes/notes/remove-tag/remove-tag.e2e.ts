import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';

describe('DELETE /api/notes/:id/tags/:tagName - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('タグを削除できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken);

    const addRes = await app.request(`/api/notes/${created.id}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: '追加タグ',
      }),
    });
    expect(addRes.status).toBe(200);

    const res = await app.request(`/api/notes/${created.id}/tags/追加タグ`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.tags).toHaveLength(0);
  });
});
