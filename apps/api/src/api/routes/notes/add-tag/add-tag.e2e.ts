import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';

describe('POST /api/notes/:id/tags - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('タグを追加できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken);

    const res = await app.request(`/api/notes/${created.id}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: '追加タグ',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.tags.map((tag: { name: string }) => tag.name)).toContain(
      '追加タグ'
    );
  });
});
