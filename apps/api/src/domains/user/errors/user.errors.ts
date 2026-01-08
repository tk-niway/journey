export class UserAlreadyExistsError extends Error {
  constructor(message: string = "このユーザーは既に存在します") {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(message: string = "このメールアドレスは既に登録されています") {
    super(message);
    this.name = this.constructor.name;
  }
}
