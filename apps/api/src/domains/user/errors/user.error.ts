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
