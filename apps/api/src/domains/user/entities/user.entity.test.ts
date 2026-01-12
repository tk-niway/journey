import { describe, expect, it } from 'vitest';
import { UserEntity } from '@domains/user/entities/user.entity';
import { UserValue } from '@domains/user/values/user.value';
import { UserCredentialValue } from '@domains/user/values/user-credential.value';

describe('UserEntity', () => {
  it('values と credential を取得できる', () => {
    const userValue = new UserValue({
      id: 'user-1',
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentialValue = new UserCredentialValue({
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword('password123'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new UserEntity(userValue, credentialValue);

    expect(entity.values.id).toBe('user-1');
    expect(entity.values.email).toBe('test@example.com');
    expect(entity.credential.id).toBe('cred-1');
  });

  it('createUserArgs はユーザー値をそのまま返す', () => {
    const userValue = new UserValue({
      id: 'user-1',
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentialValue = new UserCredentialValue({
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword('password123'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new UserEntity(userValue, credentialValue);

    expect(entity.createUserArgs()).toEqual(entity.values);
  });

  it('createUserCredentialArgs は userId を values.id に揃える', () => {
    const userValue = new UserValue({
      id: 'user-1',
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ここでは敢えて不整合な userId を入れておく
    const credentialValue = new UserCredentialValue({
      id: 'cred-1',
      userId: 'different-user',
      hashedPassword: UserCredentialValue.hashPassword('password123'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new UserEntity(userValue, credentialValue);

    const args = entity.createUserCredentialArgs();
    expect(args.userId).toBe('user-1');
  });

  it('verifyPassword は UserCredentialValue に委譲して検証できる', () => {
    const plainPassword = 'password123';
    const userValue = new UserValue({
      id: 'user-1',
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentialValue = new UserCredentialValue({
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword(plainPassword),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = new UserEntity(userValue, credentialValue);

    expect(entity.verifyPassword(plainPassword)).toBe(true);
    expect(entity.verifyPassword('wrong-password')).toBe(false);
  });
});
