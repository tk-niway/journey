import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { testRepository } from '@db/repositories/test/test.repository';
import { NoteApplication } from '@applications/note/note.application';
import { NoteTestFactory } from '@domains/note/factories/note.test-factory';

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
});
