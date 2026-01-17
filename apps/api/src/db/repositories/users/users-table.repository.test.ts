import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import { databaseService } from '@db/database.service';
import { testRepository } from '@db/repositories/test/test.repository';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { eq } from 'drizzle-orm';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { UserCreateTransactionDbError } from '@db/repositories/users/users-table.error';

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
});
