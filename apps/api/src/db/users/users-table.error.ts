export class UserTableCreateError extends Error {
  constructor(message: string = "ユーザーの作成処理に失敗しました") {
    super(message);
    this.name = this.constructor.name;
  }
}