export class UserAlreadyExistsError extends Error {
  public code: string = 'USER_ID_ALREADY_EXISTS';
  constructor(userId: string,) {
    super(`このユーザーは既に存在します id:${userId}`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends Error {
  public code: string = 'EMAIL_ALREADY_EXISTS';
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています email:${email}`);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends Error {
  public code: string = 'USER_NOT_FOUND';
  constructor(email: string) {
    super(`ユーザーが見つかりませんでした email:${email}`);
    this.name = this.constructor.name;
  }
}

export class InvalidPasswordError extends Error {
  public code: string = 'INVALID_PASSWORD';
  constructor() {
    super(`パスワードが間違っています`);
    this.name = this.constructor.name;
  }
}