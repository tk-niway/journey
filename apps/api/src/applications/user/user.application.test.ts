import { cleanupAllTables, createTestUser } from '@db/lib/helpers/database.test-helper';
import { UserApplication } from '@applications/user/user.application';

describe('UserApplication', () => {
  let userApplication: UserApplication;

  beforeEach(async () => {
    await cleanupAllTables();
    userApplication = new UserApplication();
  });

  describe('findUserById', () => {
    it('存在するユーザーIDを指定するとUserEntityを返す', async () => {
      const password = 'password123';
      const user = await createTestUser({
        email: 'test@example.com',
        password,
        name: 'テストユーザー',
      });

      const result = await userApplication.findUserById(user.values.id);

      expect(result).not.toBeNull();
      expect(result?.values.id).toBe(user.values.id);
      expect(result?.values.email).toBe(user.values.email);
      expect(result?.values.name).toBe(user.values.name);
      expect(result?.verifyPassword(password)).toBe(true);
    });

    it('存在しないユーザーIDを指定するとnullを返す', async () => {
      const result = await userApplication.findUserById('nonexistent-id');
      expect(result).toBeNull();
    });
  });
});
