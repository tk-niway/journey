import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteValue } from '@domains/note/values/note.value';
import { TagValue } from '@domains/note/values/tag.value';

describe('NoteEntity', () => {
  it('values と tags を取得できる', () => {
    const noteValue = new NoteValue({
      id: 'note-1',
      title: 'タイトル',
      content: '本文',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const tagValue = new TagValue({
      id: 'tag-1',
      name: 'タグ',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new NoteEntity(noteValue, [tagValue]);

    expect(entity.values.id).toBe('note-1');
    expect(entity.tags[0].name).toBe('タグ');
  });

  it('createNoteTagArgs は noteId と tagId を生成する', () => {
    const noteValue = new NoteValue({
      id: 'note-1',
      title: 'タイトル',
      content: '本文',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const tagValue = new TagValue({
      id: 'tag-1',
      name: 'タグ',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new NoteEntity(noteValue, [tagValue]);
    const args = entity.createNoteTagArgs();

    expect(args).toEqual([{ noteId: 'note-1', tagId: 'tag-1' }]);
  });
});
