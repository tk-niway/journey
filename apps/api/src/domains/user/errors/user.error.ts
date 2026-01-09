export class UserAlreadyExistsError extends Error {
  constructor(userId: string) {
    super(`このユーザーは既に存在します id:${userId}`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています email:${email}`);
    this.name = this.constructor.name;
  }
}
