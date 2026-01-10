import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// パスワードを安全にハッシュ化するための設定値
const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

// ハッシュ文字列のフォーマット:
// scrypt$N$r$p$salt(hex)$hash(hex)
type HashedPasswordString = string;

/**
 * パスワードをハッシュ化する純粋関数
 * - ランダムなソルトを生成
 * - scrypt を使ってキーストレッチング
 * - 文字列として保存しやすい形式にエンコード
 */
export function hashPassword(password: string): HashedPasswordString {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  const parts = [
    'scrypt',
    SCRYPT_N.toString(),
    SCRYPT_R.toString(),
    SCRYPT_P.toString(),
    salt.toString('hex'),
    derivedKey.toString('hex'),
  ];

  return parts.join('$');
}

/**
 * 入力された平文パスワードと、保存済みハッシュが一致するか検証する関数
 * - 保存済みハッシュ文字列を分解
 * - 同じパラメータ・ソルトで再度 scrypt を実行
 * - timingSafeEqual で比較し、タイミング攻撃を防ぐ
 */
export function verifyPassword(
  password: string,
  hashedPassword: HashedPasswordString
): boolean {
  const [algorithm, nStr, rStr, pStr, saltHex, hashHex] =
    hashedPassword.split('$');

  if (algorithm !== 'scrypt') {
    // 対応していないフォーマット
    return false;
  }

  if (!nStr || !rStr || !pStr || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const storedHash = Buffer.from(hashHex, 'hex');

  const derivedKey = scryptSync(password, salt, storedHash.length, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
  });

  // 長さが異なる場合も安全に false を返す
  if (derivedKey.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedHash);
}
