import { NoteValue } from '@domains/note/values/note.value';

describe('NoteValue', () => {
  it('インスタンスを作成してvaluesを取得できる', () => {
    const args = {
      id: 'note-1',
      title: 'タイトル',
      content: '本文',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const value = new NoteValue(args);
    expect(value.values).toEqual(args);
  });

  it('タイトルが空の場合は例外をスローする', () => {
    expect(
      () =>
        new NoteValue({
          id: 'note-1',
          title: '',
          content: '本文',
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    ).toThrow();
  });
});
