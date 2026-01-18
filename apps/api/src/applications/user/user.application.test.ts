import {
  cleanupAllTables,
  createTestUser,
} from '@db/lib/helpers/database.test-helper';
import { UserApplication } from '@applications/user/user.application';
import {
  EmailAlreadyExistsError,
  InvalidPasswordError,
  UserNotFoundByIdError,
} from '@domains/user/errors/user.error';

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

  describe('listUsers', () => {
    it('ユーザー一覧を取得できる', async () => {
      await createTestUser({
        email: 'list-user-1@example.com',
        password: 'password123',
        name: 'ユーザー1',
      });
      await createTestUser({
        email: 'list-user-2@example.com',
        password: 'password123',
        name: 'ユーザー2',
      });

      const users = await userApplication.listUsers({
        limit: 10,
        offset: 0,
      });

      const emails = users.map((user) => user.email);
      expect(emails).toContain('list-user-1@example.com');
      expect(emails).toContain('list-user-2@example.com');
    });

    it('limit/offsetで件数を制御できる', async () => {
      await createTestUser({
        email: 'list-user-3@example.com',
        password: 'password123',
        name: 'ユーザー3',
      });
      await createTestUser({
        email: 'list-user-4@example.com',
        password: 'password123',
        name: 'ユーザー4',
      });

      const users = await userApplication.listUsers({
        limit: 1,
        offset: 0,
      });

      expect(users.length).toBe(1);
    });
  });

  describe('updateUser', () => {
    it('名前とメールアドレスを更新できる', async () => {
      const user = await createTestUser({
        email: 'update-user@example.com',
        password: 'password123',
        name: '更新前ユーザー',
      });

      const updated = await userApplication.updateUser(user.values.id, {
        name: '更新後ユーザー',
        email: 'update-user-new@example.com',
      });

      expect(updated.values.name).toBe('更新後ユーザー');
      expect(updated.values.email).toBe('update-user-new@example.com');
    });

    it('パスワードを更新できる', async () => {
      const user = await createTestUser({
        email: 'update-password@example.com',
        password: 'password123',
        name: '更新対象ユーザー',
      });

      const updated = await userApplication.updateUser(user.values.id, {
        currentPassword: 'password123',
        newPassword: 'newPassword123',
      });

      expect(updated.verifyPassword('newPassword123')).toBe(true);
    });

    it('現在のパスワードが違う場合はエラー', async () => {
      const user = await createTestUser({
        email: 'update-password-fail@example.com',
        password: 'password123',
        name: '更新対象ユーザー',
      });

      await expect(
        userApplication.updateUser(user.values.id, {
          currentPassword: 'wrongPassword123',
          newPassword: 'newPassword123',
        })
      ).rejects.toThrow(InvalidPasswordError);
    });

    it('メールアドレスが重複するとエラー', async () => {
      await createTestUser({
        email: 'duplicate-email-1@example.com',
        password: 'password123',
        name: 'ユーザー1',
      });
      const user2 = await createTestUser({
        email: 'duplicate-email-2@example.com',
        password: 'password123',
        name: 'ユーザー2',
      });

      await expect(
        userApplication.updateUser(user2.values.id, {
          email: 'duplicate-email-1@example.com',
        })
      ).rejects.toThrow(EmailAlreadyExistsError);
    });

    it('存在しないユーザーIDの場合はエラー', async () => {
      await expect(
        userApplication.updateUser('nonexistent-id', {
          name: '更新ユーザー',
        })
      ).rejects.toThrow(UserNotFoundByIdError);
    });
  });
});
