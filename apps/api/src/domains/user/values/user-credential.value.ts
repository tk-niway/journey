import z from "zod";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// パスワードを安全にハッシュ化するための設定値
const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

export interface UserCredentialValueObject {
  id: string;
  userId: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentialValueArgs extends UserCredentialValueObject { }

export class UserCredentialValue {
  constructor(values: UserCredentialValueArgs) {
    this._values = this.valueValidator(values);
  }

  private _values: UserCredentialValueObject;

  private valueValidator(values: UserCredentialValueArgs): UserCredentialValueObject {
    return z.object({
      id: z.string().min(1, 'Id is required'),
      userId: z.string().min(1, 'User ID is required'),
      hashedPassword: z.string().min(1, 'Hashed password is required'),
      createdAt: z.date(),
      updatedAt: z.date(),
    }).strip().parse(values);
  }

  get values(): UserCredentialValueObject {
    return this._values;
  }

  static hashPassword(password: string): string {
    const salt = randomBytes(16);
    const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
    });

    const parts = [
      "scrypt",
      SCRYPT_N.toString(),
      SCRYPT_R.toString(),
      SCRYPT_P.toString(),
      salt.toString("hex"),
      derivedKey.toString("hex"),
    ];

    return parts.join("$");
  }

  verifyPassword(
    password: string,
  ): boolean {
    const [algorithm, nStr, rStr, pStr, saltHex, hashHex] = this.values.hashedPassword.split(
      "$",
    );

    if (algorithm !== "scrypt") {
      // 対応していないフォーマット
      return false;
    }

    if (!nStr || !rStr || !pStr || !saltHex || !hashHex) {
      return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const storedHash = Buffer.from(hashHex, "hex");

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
}