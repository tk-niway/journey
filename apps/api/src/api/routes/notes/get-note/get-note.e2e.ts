import { beforeEach, describe, expect, it } from 'vitest';
import app from '@api/index';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  createNote,
  createUserAndToken,
} from '@api/routes/notes/note-test.helper';
import { ErrorCode } from '@shared/error-code.const';

describe('GET /api/notes/:id - E2E', () => {
  beforeEach(async () => {
    await cleanupAllTables();
  });

  it('ノート詳細を取得できる', async () => {
    const { accessToken } = await createUserAndToken();
    const created = await createNote(accessToken, {
      title: 'テストタイトル',
      content: 'テスト本文',
      tags: ['タグ1'],
    });

    const res = await app.request(`/api/notes/${created.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(created.id);
    expect(body.title).toBe('テストタイトル');
    expect(body.tags[0].name).toBe('タグ1');
  });

  it('他ユーザーのノートは取得できない', async () => {
    const userA = await createUserAndToken();
    const userB = await createUserAndToken();
    const created = await createNote(userA.accessToken);

    const res = await app.request(`/api/notes/${created.id}`, {
      headers: {
        Authorization: `Bearer ${userB.accessToken}`,
      },
    });

    expect(res.status).toBe(401);
    const errorBody = await res.json();
    expect(errorBody.error.code).toBe(ErrorCode.USER_INVALID);
  });
});
