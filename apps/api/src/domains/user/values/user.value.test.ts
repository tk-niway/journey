import { UserValue } from '@domains/user/values/user.value';

describe('UserValue', () => {
  it('インスタンスを作成してvaluesを取得できる', () => {
    const args = {
      id: '1',
      name: 'test',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const userValue = new UserValue(args);
    expect(userValue.values).toEqual(args);
  });
});
