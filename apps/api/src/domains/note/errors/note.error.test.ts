import { describe, expect, it } from 'vitest';
import { NoteNotFoundError } from '@domains/note/errors/note.error';

describe('note.error', () => {
  it('NoteNotFoundError はメッセージと name を設定できる', () => {
    const err = new NoteNotFoundError('note-1');
    expect(err.name).toBe('NoteNotFoundError');
    expect(err.message).toContain('ノートが見つかりませんでした');
    expect(err.message).toContain('note-1');
    expect(err.code).toBeUndefined();
  });
});
