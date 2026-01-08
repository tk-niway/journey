export class UserCreateError extends Error {
  constructor(message: string = "ユーザーの作成処理に失敗しました") {
    super(message);
    this.name = "UserCreateError";
  }
}