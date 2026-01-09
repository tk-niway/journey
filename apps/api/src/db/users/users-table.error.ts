export class UserTableCreateError extends Error {
  constructor() {
    super(`ユーザー作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}