import { describe, expect, it } from 'vitest';
import { NoteFactory } from '@domains/note/factories/note.factory';
import type { NoteValueObject } from '@domains/note/values/note.value';
import type { TagValueObject } from '@domains/note/values/tag.value';

describe('NoteFactory', () => {
  describe('createNewNoteValue', () => {
    it('id / createdAt / updatedAt を省略しても生成できる', () => {
      const value = NoteFactory.createNewNoteValue({
        title: 'タイトル',
        content: '本文',
        userId: 'user-1',
      });

      expect(value.values.id).toBeTypeOf('string');
      expect(value.values.id.length).toBeGreaterThan(0);
      expect(value.values.createdAt).toBeInstanceOf(Date);
      expect(value.values.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('createNoteEntity', () => {
    it('引数に NoteValue / TagValue を渡して NoteEntity を生成できる', () => {
      const noteValue = NoteFactory.createNewNoteValue({
        id: 'note-1',
        title: 'タイトル',
        content: '本文',
        userId: 'user-1',
      });
      const tagValue = NoteFactory.createNewTagValue({
        id: 'tag-1',
        name: 'タグ',
        userId: 'user-1',
      });

      const entity = NoteFactory.createNoteEntity(noteValue, [tagValue]);

      expect(entity.values.id).toBe('note-1');
      expect(entity.tags[0].name).toBe('タグ');
    });

    it('引数にプレーンなオブジェクトを渡して NoteEntity を生成できる', () => {
      const noteValueArgs: NoteValueObject = {
        id: 'note-1',
        title: 'タイトル',
        content: '本文',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const tagValueArgs: TagValueObject = {
        id: 'tag-1',
        name: 'タグ',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const entity = NoteFactory.createNoteEntity(noteValueArgs, [
        tagValueArgs,
      ]);

      expect(entity.values.title).toBe('タイトル');
      expect(entity.tags[0].name).toBe('タグ');
    });

    it('同一ユーザー内のタグ名が重複しない', () => {
      const noteValue = NoteFactory.createNewNoteValue({
        id: 'note-1',
        title: 'タイトル',
        content: '本文',
        userId: 'user-1',
      });
      const tagValue1 = NoteFactory.createNewTagValue({
        id: 'tag-1',
        name: 'タグ',
        userId: 'user-1',
      });
      const tagValue2 = NoteFactory.createNewTagValue({
        id: 'tag-2',
        name: 'タグ',
        userId: 'user-1',
      });

      const entity = NoteFactory.createNoteEntity(noteValue, [
        tagValue1,
        tagValue2,
      ]);

      expect(entity.tags).toHaveLength(1);
      expect(entity.tags[0].name).toBe('タグ');
    });
  });
});
