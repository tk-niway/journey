import { z } from 'zod';

/**
 * 認証関連の共通バリデーションスキーマ
 */

/** 名前のバリデーション */
export const nameSchema = z
  .string()
  .min(2, '名前は2文字以上で入力してください。')
  .max(100, '名前は100文字以内で入力してください。');

/** メールアドレスのバリデーション */
export const emailSchema = z
  .string()
  .email('有効なメールアドレスを入力してください。');

/** パスワードのバリデーション */
export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください。')
  .max(100, 'パスワードは100文字以内で入力してください。');
