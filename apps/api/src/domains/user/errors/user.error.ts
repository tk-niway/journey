import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';

export class UserAlreadyExistsError extends DomainErrorAbstract {
  code = undefined;
  constructor(userId: string) {
    super(`このユーザーは既に存在します id:${userId}`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends DomainErrorAbstract {
  code = undefined;
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています email:${email}`);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends DomainErrorAbstract {
  code = undefined;
  constructor(email: string) {
    super(`ユーザーが見つかりませんでした email:${email}`);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundByIdError extends DomainErrorAbstract {
  code = undefined;
  constructor(userId: string) {
    super(`ユーザーが見つかりませんでした id:${userId}`);
    this.name = this.constructor.name;
  }
}

export class InvalidPasswordError extends DomainErrorAbstract {
  code = undefined;
  constructor() {
    super(`パスワードが間違っています`);
    this.name = this.constructor.name;
  }
}
