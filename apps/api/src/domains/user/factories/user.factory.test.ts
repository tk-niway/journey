import { describe, expect, it } from 'vitest';
import { UserFactory } from '@domains/user/factories/user.factory';
import { UserCredentialValue } from '@domains/user/values/user-credential.value';
import type { UserValueObject } from '@domains/user/values/user.value';
import type { UserCredentialValueObject } from '@domains/user/values/user-credential.value';

describe('UserFactory', () => {
  describe('createNewUserValue', () => {
    it('id / createdAt / updatedAt を省略しても生成できる', () => {
      const value = UserFactory.createNewUserValue({
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      expect(value.values.id).toBeTypeOf('string');
      expect(value.values.id.length).toBeGreaterThan(0);
      expect(value.values.name).toBe('テストユーザー');
      expect(value.values.email).toBe('test@example.com');
      expect(value.values.createdAt).toBeInstanceOf(Date);
      expect(value.values.updatedAt).toBeInstanceOf(Date);
    });

    it('id / createdAt / updatedAt を指定して生成できる', () => {
      const createdAt = new Date('2020-01-01T00:00:00.000Z');
      const updatedAt = new Date('2020-01-02T00:00:00.000Z');

      const value = UserFactory.createNewUserValue({
        id: 'user-1',
        name: 'テストユーザー',
        email: 'test@example.com',
        createdAt,
        updatedAt,
      });

      expect(value.values.id).toBe('user-1');
      expect(value.values.createdAt).toBe(createdAt);
      expect(value.values.updatedAt).toBe(updatedAt);
    });
  });

  describe('createNewUserCredentialValue', () => {
    it('plainPassword から hashedPassword を生成できる', () => {
      const plainPassword = 'password123';

      const value = UserFactory.createNewUserCredentialValue({
        userId: 'user-1',
        plainPassword,
      });

      expect(value.values.userId).toBe('user-1');
      expect(value.values.hashedPassword).toBeTypeOf('string');
      expect(value.values.hashedPassword).not.toBe(plainPassword);
      expect(value.verifyPassword(plainPassword)).toBe(true);
    });
  });

  describe('createUserEntity', () => {
    it('引数に UserValue / UserCredentialValue を渡して UserEntity を生成できる', () => {
      const userValue = UserFactory.createNewUserValue({
        id: 'user-1',
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      const credentialValue = UserFactory.createNewUserCredentialValue({
        id: 'cred-1',
        userId: userValue.values.id,
        plainPassword: 'password123',
      });

      const entity = UserFactory.createUserEntity(userValue, credentialValue);

      expect(entity.values.id).toBe('user-1');
      expect(entity.credential.id).toBe('cred-1');
      expect(entity.verifyPassword('password123')).toBe(true);
    });

    it('引数にプレーンなオブジェクトを渡して UserEntity を生成できる', () => {
      const userValueArgs: UserValueObject = {
        id: 'user-1',
        name: 'テストユーザー',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const credentialValueArgs: UserCredentialValueObject = {
        id: 'cred-1',
        userId: 'user-1',
        hashedPassword: UserCredentialValue.hashPassword('password123'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const entity = UserFactory.createUserEntity(
        userValueArgs,
        credentialValueArgs
      );

      expect(entity.values.email).toBe('test@example.com');
      expect(entity.verifyPassword('password123')).toBe(true);
    });
  });
});
