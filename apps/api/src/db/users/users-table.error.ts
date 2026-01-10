export class UserTableCreateError extends Error {
  public code: string = 'USER_DATA_CREATE_USER_ERROR';
  constructor() {
    super(`ユーザー作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserCredentialCreateError extends Error {
  public code: string = 'USER_CREDENTIAL_DATA_CREATE_ERROR';
  constructor() {
    super(`認証情報登録に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserTableCreateTransactionError extends Error {
  public code: string = 'USER_TABLE_CREATE_TRANSACTION_ERROR';
  constructor() {
    super(`ユーザー作成処理中にエラーが発生しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}