import { AuthApplication } from './auth.application';
import { cleanupAllTables } from '@db/lib/helpers/database.test-helper';
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
} from '@domains/user/errors/user.error';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '@db/repositories/test/test.repository';

describe('AuthApplication', () => {
  let authApplication: AuthApplication;

  beforeEach(async () => {
    await cleanupAllTables();
    authApplication = new AuthApplication();
  });

  describe('signup', () => {
    const validInput = {
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
    };

    it('新規ユーザーをサインアップしてDBに登録できる', async () => {
      // signupを実行
      const result = await authApplication.signup(validInput);

      // 戻り値のUserEntityを検証
      expect(result).toBeDefined();
      expect(result.values.name).toBe(validInput.name);
      expect(result.values.email).toBe(validInput.email);
      expect(result.values.id).toBeDefined();

      // DBから取得して登録されていることを確認
      const userInDb = await testRepository.findUserByEmail(validInput.email);
      expect(userInDb).toBeDefined();
      expect(userInDb?.id).toBe(result.values.id);
      expect(userInDb?.name).toBe(validInput.name);
      expect(userInDb?.email).toBe(validInput.email);
    });

    it('同じメールアドレスで2回サインアップするとEmailAlreadyExistsErrorをスロー', async () => {
      // 1回目のsignupは成功
      await authApplication.signup(validInput);

      // 2回目は同じemailでEmailAlreadyExistsErrorをスロー
      const duplicateInput = {
        name: '別のユーザー',
        email: validInput.email, // 同じメールアドレス
        password: 'differentPassword',
      };

      await expect(authApplication.signup(duplicateInput)).rejects.toThrow(
        EmailAlreadyExistsError
      );
    });
  });

  describe('login', () => {
    it('登録済みユーザーが正しいパスワードでログインできる', async () => {
      const testPassword = 'password123';
      const testEmail = 'test@example.com';
      // UserTestFactoryでユーザーを作成し、DBに登録
      const userEntity = UserTestFactory.createUserEntity(
        { email: testEmail },
        { plainPassword: testPassword }
      );
      await testRepository.createUser(userEntity);

      // 同じemail/passwordでloginを実行
      const result = await authApplication.login(testEmail, testPassword);

      // 戻り値のUserEntityが同じユーザーであることを確認
      expect(result).toBeDefined();
      expect(result.values.id).toBe(userEntity.values.id);
      expect(result.values.email).toBe(testEmail);
      // パスワードの検証が成功していることを確認
      expect(result.verifyPassword(testPassword)).toBe(true);
    });

    it('存在しないメールアドレスでログインするとUserNotFoundErrorをスロー', async () => {
      // DBにユーザーがいない状態でloginを実行
      await expect(
        authApplication.login('nonexistent@example.com', 'anyPassword')
      ).rejects.toThrow(UserNotFoundError);
    });

    it('パスワードが間違っている場合InvalidPasswordErrorをスロー', async () => {
      const testPassword = 'password123';
      const testEmail = 'test@example.com';
      // UserTestFactoryでユーザーを作成し、DBに登録
      const userEntity = UserTestFactory.createUserEntity(
        { email: testEmail },
        { plainPassword: testPassword }
      );
      await testRepository.createUser(userEntity);

      // 間違ったパスワードでloginを実行
      await expect(
        authApplication.login(testEmail, 'wrongPassword')
      ).rejects.toThrow(InvalidPasswordError);
    });
  });
});
