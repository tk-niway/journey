import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { databaseService } from '@db/database.service';
import { testRepository } from '@db/repositories/test/test.repository';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { NoteApplication } from '@applications/note/note.application';
import { NoteTestFactory } from '@domains/note/factories/note.test-factory';
import { NoteNotFoundError } from '@domains/note/errors/note.error';
import { and, eq } from 'drizzle-orm';

describe('NoteApplication', () => {
  let noteApplication: NoteApplication;

  beforeEach(async () => {
    await cleanupAllTables();
    noteApplication = new NoteApplication();
  });

  it('ノートを作成して取得できる（Tag含む）', async () => {
    const user = await createTestUser({
      email: 'note-test@example.com',
      password: 'password123',
    });

    const created = await noteApplication.createNote({
      userId: user.values.id,
      title: 'テストタイトル',
      content: 'テスト本文',
      tags: ['タグ1', 'タグ2'],
    });

    expect(created.values.userId).toBe(user.values.id);
    expect(created.tags.map((t) => t.name)).toEqual(['タグ1', 'タグ2']);

    const fetched = await noteApplication.getNoteById(created.values.id);
    expect(fetched.values.id).toBe(created.values.id);
    expect(fetched.tags.map((t) => t.name)).toEqual(['タグ1', 'タグ2']);
  });

  it('ユーザーIDでノート一覧を取得できる', async () => {
    const user = await createTestUser({
      email: 'note-list@example.com',
      password: 'password123',
    });

    const note1 = NoteTestFactory.createNoteEntity({
      userId: user.values.id,
      tagNames: ['タグA'],
    });
    const note2 = NoteTestFactory.createNoteEntity({
      userId: user.values.id,
      tagNames: [],
    });

    await testRepository.createNote(note1);
    await testRepository.createNote(note2);

    const notes = await noteApplication.findNotesByUserId(user.values.id);
    expect(notes.length).toBe(2);
    const ids = notes.map((n) => n.values.id);
    expect(ids).toContain(note1.values.id);
    expect(ids).toContain(note2.values.id);
  });

  it('同一ユーザーは同じ名前のタグを複数持てない', async () => {
    const user = await createTestUser({
      email: 'tag-unique@example.com',
      password: 'password123',
    });

    await noteApplication.createNote({
      userId: user.values.id,
      title: 'note-1',
      content: 'content',
      tags: ['重複タグ'],
    });

    await noteApplication.createNote({
      userId: user.values.id,
      title: 'note-2',
      content: 'content',
      tags: ['重複タグ'],
    });

    const tags = await databaseService
      .select()
      .from(tagsTable)
      .where(
        and(
          eq(tagsTable.userId, user.values.id),
          eq(tagsTable.name, '重複タグ')
        )
      );

    expect(tags.length).toBe(1);
  });

  it('別ユーザーなら同じ名前のタグを持てる', async () => {
    const user1 = await createTestUser({
      email: 'tag-same-name-1@example.com',
      password: 'password123',
    });
    const user2 = await createTestUser({
      email: 'tag-same-name-2@example.com',
      password: 'password123',
    });

    await noteApplication.createNote({
      userId: user1.values.id,
      title: 'note-1',
      content: 'content',
      tags: ['共有タグ'],
    });

    await noteApplication.createNote({
      userId: user2.values.id,
      title: 'note-2',
      content: 'content',
      tags: ['共有タグ'],
    });

    const tags = await databaseService
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.name, '共有タグ'));

    expect(tags.length).toBe(2);
    expect(tags.map((t) => t.userId).sort()).toEqual(
      [user1.values.id, user2.values.id].sort()
    );
  });

  it('ノートを更新できる', async () => {
    const user = await createTestUser({
      email: 'note-update@example.com',
      password: 'password123',
    });

    const created = await noteApplication.createNote({
      userId: user.values.id,
      title: '元タイトル',
      content: '元本文',
      tags: ['タグ1'],
    });

    const updated = await noteApplication.updateNote({
      id: created.values.id,
      title: '更新タイトル',
      content: '更新本文',
      userId: user.values.id,
    });

    expect(updated.values.title).toBe('更新タイトル');
    expect(updated.values.content).toBe('更新本文');
    expect(updated.tags.map((tag) => tag.name)).toEqual(['タグ1']);
  });

  it('タグを追加できる', async () => {
    const user = await createTestUser({
      email: 'note-add-tag@example.com',
      password: 'password123',
    });

    const created = await noteApplication.createNote({
      userId: user.values.id,
      title: 'タイトル',
      content: '本文',
      tags: ['タグ1'],
    });

    const updated = await noteApplication.addTagToNote(
      created.values.id,
      'タグ2',
      user.values.id
    );

    expect(updated.tags.map((tag) => tag.name).sort()).toEqual(
      ['タグ1', 'タグ2'].sort()
    );
  });

  it('タグを削除できる', async () => {
    const user = await createTestUser({
      email: 'note-remove-tag@example.com',
      password: 'password123',
    });

    const created = await noteApplication.createNote({
      userId: user.values.id,
      title: 'タイトル',
      content: '本文',
      tags: ['タグ1', 'タグ2'],
    });

    const updated = await noteApplication.removeTagFromNote(
      created.values.id,
      'タグ1',
      user.values.id
    );

    expect(updated.tags.map((tag) => tag.name)).toEqual(['タグ2']);
  });

  it('ノートを削除できる', async () => {
    const user = await createTestUser({
      email: 'note-delete@example.com',
      password: 'password123',
    });

    const created = await noteApplication.createNote({
      userId: user.values.id,
      title: 'タイトル',
      content: '本文',
      tags: [],
    });

    await noteApplication.deleteNote(created.values.id);

    await expect(
      noteApplication.getNoteById(created.values.id)
    ).rejects.toThrow(NoteNotFoundError);
  });
});
