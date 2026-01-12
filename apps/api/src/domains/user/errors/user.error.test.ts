import { describe, expect, it } from 'vitest';
import {
  EmailAlreadyExistsError,
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@domains/user/errors/user.error';

describe('user.error', () => {
  it('UserAlreadyExistsError はメッセージと name を設定できる', () => {
    const err = new UserAlreadyExistsError('user-1');
    expect(err.name).toBe('UserAlreadyExistsError');
    expect(err.message).toContain('このユーザーは既に存在します');
    expect(err.code).toBeUndefined();
  });

  it('EmailAlreadyExistsError はメッセージと name を設定できる', () => {
    const err = new EmailAlreadyExistsError('test@example.com');
    expect(err.name).toBe('EmailAlreadyExistsError');
    expect(err.message).toContain('このメールアドレスは既に登録されています');
    expect(err.message).toContain('test@example.com');
    expect(err.code).toBeUndefined();
  });

  it('UserNotFoundError はメッセージと name を設定できる', () => {
    const err = new UserNotFoundError('test@example.com');
    expect(err.name).toBe('UserNotFoundError');
    expect(err.message).toContain('ユーザーが見つかりませんでした');
    expect(err.message).toContain('test@example.com');
    expect(err.code).toBeUndefined();
  });

  it('InvalidPasswordError はメッセージと name を設定できる', () => {
    const err = new InvalidPasswordError();
    expect(err.name).toBe('InvalidPasswordError');
    expect(err.message).toBe('パスワードが間違っています');
    expect(err.code).toBeUndefined();
  });
});
