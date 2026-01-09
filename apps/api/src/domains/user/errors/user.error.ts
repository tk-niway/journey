export class UserAlreadyExistsError extends Error {
  constructor(userId: string) {
    super(`このユーザーは既に存在します ${{userId}}`);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`このメールアドレスは既に登録されています ${{email}}`);
    this.name = this.constructor.name;
  }
}
