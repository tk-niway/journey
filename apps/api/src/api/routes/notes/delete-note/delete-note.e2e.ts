import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';
import { ErrorCode } from '@shared/error-code.const';

describe('DELETE /api/notes/:id - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('ノートを削除できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken);

    const deleteRes = await app.request(`/api/notes/${created.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(deleteRes.status).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.id).toBe(created.id);

    const getRes = await app.request(`/api/notes/${created.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(getRes.status).toBe(404);
    const errorBody = await getRes.json();
    expect(errorBody.error.code).toBe(ErrorCode.NOTE_NOT_FOUND);
  });
});
