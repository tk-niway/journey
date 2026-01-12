import { describe, expect, it } from 'vitest';
import { UserCredentialValue } from '@domains/user/values/user-credential.value';

describe('UserCredentialValue', () => {
  it('インスタンスを作成してvaluesを取得できる', () => {
    const args = {
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword('password123'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const value = new UserCredentialValue(args);

    expect(value.values).toEqual(args);
  });

  it('hashPasswordは scrypt のフォーマットでハッシュを生成できる', () => {
    const hashed = UserCredentialValue.hashPassword('password123');

    const parts = hashed.split('$');
    expect(parts.length).toBe(6);
    expect(parts[0]).toBe('scrypt');

    // 実装の固定パラメータが文字列化されていることだけを検証する
    expect(parts[1]).toBe('16384');
    expect(parts[2]).toBe('8');
    expect(parts[3]).toBe('1');

    // salt / hash は hex 文字列
    expect(parts[4]).toMatch(/^[0-9a-f]+$/i);
    expect(parts[5]).toMatch(/^[0-9a-f]+$/i);
  });

  it('正しいパスワードの場合は verifyPassword が true を返す', () => {
    const plainPassword = 'password123';
    const args = {
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword(plainPassword),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const value = new UserCredentialValue(args);

    expect(value.verifyPassword(plainPassword)).toBe(true);
  });

  it('間違ったパスワードの場合は verifyPassword が false を返す', () => {
    const args = {
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: UserCredentialValue.hashPassword('password123'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const value = new UserCredentialValue(args);

    expect(value.verifyPassword('wrong-password')).toBe(false);
  });

  it('未対応のアルゴリズムの場合は verifyPassword が false を返す', () => {
    const args = {
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: 'bcrypt$10$salt$hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const value = new UserCredentialValue(args);

    expect(value.verifyPassword('password123')).toBe(false);
  });

  it('ハッシュ形式が壊れている場合は verifyPassword が false を返す', () => {
    const args = {
      id: 'cred-1',
      userId: 'user-1',
      hashedPassword: 'scrypt$16384$8$1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const value = new UserCredentialValue(args);

    expect(value.verifyPassword('password123')).toBe(false);
  });
});
