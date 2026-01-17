import { TagValue } from '@domains/note/values/tag.value';

describe('TagValue', () => {
  it('インスタンスを作成してvaluesを取得できる', () => {
    const args = {
      id: 'tag-1',
      name: 'タグ',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const value = new TagValue(args);
    expect(value.values).toEqual(args);
  });

  it('タグ名が空の場合は例外をスローする', () => {
    expect(
      () =>
        new TagValue({
          id: 'tag-1',
          name: '',
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    ).toThrow();
  });
});
