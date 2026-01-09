export class UserTableCreateError extends Error {
  public code: string = 'USER_TABLE_CREATE_USER_ERROR';
  constructor() {
    super(`ユーザー作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}