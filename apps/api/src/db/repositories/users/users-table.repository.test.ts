import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import { databaseService } from '@db/database.service';
import { testRepository } from '@db/repositories/test/test.repository';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { eq } from 'drizzle-orm';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { UserCreateTransactionDbError } from '@db/repositories/users/users-table.error';
import { UserFactory } from '@domains/user/factories/user.factory';

describe('UsersTableRepository', () => {
  let usersTableRepository: UsersTableRepository;

  beforeEach(async () => {
    await cleanupAllTables();
    usersTableRepository = new UsersTableRepository(databaseService);
  });

  describe('findById', () => {
    it('ユーザーIDでユーザーを取得できる（認証情報も含めて復元される）', async () => {
      const plainPassword = 'password123';
      const userEntity = UserTestFactory.createUserEntity(
        { email: 'test@example.com', name: 'テストユーザー' },
        { plainPassword }
      );
      await testRepository.createUser(userEntity);

      const result = await usersTableRepository.findById(userEntity.values.id);

      expect(result).not.toBeNull();
      expect(result?.values.id).toBe(userEntity.values.id);
      expect(result?.values.email).toBe(userEntity.values.email);
      expect(result?.values.name).toBe(userEntity.values.name);
      expect(result?.verifyPassword(plainPassword)).toBe(true);
    });

    it('存在しないユーザーIDの場合はnullを返す', async () => {
      const result = await usersTableRepository.findById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('メールアドレスでユーザーを取得できる（認証情報も含めて復元される）', async () => {
      const plainPassword = 'password123';
      const userEntity = UserTestFactory.createUserEntity(
        { email: 'test@example.com', name: 'テストユーザー' },
        { plainPassword }
      );
      await testRepository.createUser(userEntity);

      const result = await usersTableRepository.findByEmail(
        userEntity.values.email
      );

      expect(result).not.toBeNull();
      expect(result?.values.id).toBe(userEntity.values.id);
      expect(result?.values.email).toBe(userEntity.values.email);
      expect(result?.values.name).toBe(userEntity.values.name);
      expect(result?.verifyPassword(plainPassword)).toBe(true);
    });

    it('存在しないメールアドレスの場合はnullを返す', async () => {
      const result = await usersTableRepository.findByEmail(
        'missing@example.com'
      );
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('ユーザーと認証情報をトランザクションで作成できる', async () => {
      const plainPassword = 'password123';
      const userEntity = UserTestFactory.createUserEntity(
        { email: 'test@example.com', name: 'テストユーザー' },
        { plainPassword }
      );

      const created = await usersTableRepository.create(userEntity);

      expect(created).toBeDefined();
      expect(created.values.id).toBe(userEntity.values.id);
      expect(created.values.email).toBe(userEntity.values.email);
      expect(created.values.name).toBe(userEntity.values.name);
      expect(created.verifyPassword(plainPassword)).toBe(true);

      // DBにusersレコードが登録されていることを確認
      const userInDb = await testRepository.findUserByEmail(
        userEntity.values.email
      );
      expect(userInDb).toBeDefined();
      expect(userInDb?.id).toBe(userEntity.values.id);

      // DBにuser_credentialsレコードが登録されていることを確認
      const credentialInDb =
        await databaseService.query.userCredentialsTable.findFirst({
          where: eq(userCredentialsTable.userId, userEntity.values.id),
        });
      expect(credentialInDb).toBeDefined();
      expect(credentialInDb?.userId).toBe(userEntity.values.id);
    });

    it('メールアドレスが重複している場合はUserCreateTransactionDbErrorをスローし、追加のレコードは作成されない', async () => {
      const email = 'duplicate@example.com';

      const first = UserTestFactory.createUserEntity(
        { email, name: 'ユーザー1' },
        { plainPassword: 'password1' }
      );
      const second = UserTestFactory.createUserEntity(
        { email, name: 'ユーザー2' },
        { plainPassword: 'password2' }
      );

      await usersTableRepository.create(first);

      await expect(usersTableRepository.create(second)).rejects.toThrow(
        UserCreateTransactionDbError
      );

      // 2人目は失敗しているので、emailが同じユーザーは1件のまま
      const users = await databaseService.query.usersTable.findMany({
        where: (t, { eq }) => eq(t.email, email),
      });
      expect(users.length).toBe(1);

      const credentials =
        await databaseService.query.userCredentialsTable.findMany({
          where: (t, { inArray }) =>
            inArray(
              t.userId,
              users.map((u) => u.id)
            ),
        });
      expect(credentials.length).toBe(1);
    });
  });

  describe('update', () => {
    it('ユーザー情報を更新できる', async () => {
      const plainPassword = 'password123';
      const userEntity = UserTestFactory.createUserEntity(
        { email: 'update@example.com', name: '更新前ユーザー' },
        { plainPassword }
      );
      await testRepository.createUser(userEntity);

      const fetched = await usersTableRepository.findById(userEntity.values.id);
      expect(fetched).not.toBeNull();
      if (!fetched) return;

      const updatedUserValue = UserFactory.createUserValue({
        ...fetched.values,
        name: '更新後ユーザー',
        email: 'update-new@example.com',
        updatedAt: new Date(),
      });

      const updatedEntity = UserFactory.createUserEntity(
        updatedUserValue.values,
        fetched.credential
      );

      const updated = await usersTableRepository.update(updatedEntity, {
        updateCredential: false,
      });

      expect(updated.values.name).toBe('更新後ユーザー');
      expect(updated.values.email).toBe('update-new@example.com');
      expect(updated.verifyPassword(plainPassword)).toBe(true);
    });

    it('パスワードを更新できる', async () => {
      const plainPassword = 'password123';
      const userEntity = UserTestFactory.createUserEntity(
        { email: 'update-password@example.com', name: '更新対象ユーザー' },
        { plainPassword }
      );
      await testRepository.createUser(userEntity);

      const fetched = await usersTableRepository.findById(userEntity.values.id);
      expect(fetched).not.toBeNull();
      if (!fetched) return;

      const updatedCredential = UserFactory.createUpdatedUserCredentialValue({
        current: fetched.credential,
        plainPassword: 'newPassword123',
      });

      const updatedEntity = UserFactory.createUserEntity(
        fetched.values,
        updatedCredential.values
      );

      const updated = await usersTableRepository.update(updatedEntity, {
        updateCredential: true,
      });

      expect(updated.verifyPassword('newPassword123')).toBe(true);
    });
  });

  describe('findMany', () => {
    it('ユーザー一覧を取得できる', async () => {
      // createdAtを明示的に設定して順序を保証する
      // SQLiteのunixepoch()は秒単位のため、1秒ずつずらす
      const baseTime = new Date('2024-01-01T00:00:00Z');
      const user1 = UserTestFactory.createUserEntity(
        {
          email: 'list-1@example.com',
          name: 'ユーザー1',
          createdAt: new Date(baseTime.getTime() + 1000),
        },
        { plainPassword: 'password1' }
      );
      const user2 = UserTestFactory.createUserEntity(
        {
          email: 'list-2@example.com',
          name: 'ユーザー2',
          createdAt: new Date(baseTime.getTime() + 2000),
        },
        { plainPassword: 'password2' }
      );
      const user3 = UserTestFactory.createUserEntity(
        {
          email: 'list-3@example.com',
          name: 'ユーザー3',
          createdAt: new Date(baseTime.getTime() + 3000),
        },
        { plainPassword: 'password3' }
      );

      await testRepository.createUser(user1);
      await testRepository.createUser(user2);
      await testRepository.createUser(user3);

      const users = await usersTableRepository.findMany({
        limit: 2,
        offset: 0,
      });

      expect(users.length).toBe(2);
      const emails = users.map((user) => user.email);
      // findManyはdesc(createdAt)で降順ソートされるため、最新の2件（user3, user2）が返される
      // createdAtを明示的に設定しているため、順序が保証される
      expect(emails).toEqual(['list-3@example.com', 'list-2@example.com']);
    });
  });
});
