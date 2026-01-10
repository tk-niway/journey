import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';

export class UserAlreadyExistsError extends DomainErrorAbstract {
  public code: string = 'USER_ID_ALREADY_EXISTS';
  constructor(userId: string) {
    super(`このユーザーは既に存在します id:${userId}`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends DomainErrorAbstract {
  public code: string = 'EMAIL_ALREADY_EXISTS';
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています email:${email}`);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends DomainErrorAbstract {
  public code: string = 'USER_NOT_FOUND';
  constructor(email: string) {
    super(`ユーザーが見つかりませんでした email:${email}`);
    this.name = this.constructor.name;
  }
}

export class InvalidPasswordError extends DomainErrorAbstract {
  public code: string = 'INVALID_PASSWORD';
  constructor() {
    super(`パスワードが間違っています`);
    this.name = this.constructor.name;
  }
}
