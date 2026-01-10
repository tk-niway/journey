import { DbErrorAbstract } from '@db/lib/error/db-error.abstract';

export class UserCreateDbError extends DbErrorAbstract {
  public code: string = 'USER_CREATE_USER_DB_ERROR';
  constructor() {
    super(`ユーザー作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserCredentialCreateDbError extends DbErrorAbstract {
  public code: string = 'USER_CREDENTIAL_CREATE_DB_ERROR';
  constructor() {
    super(`認証情報登録に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserCreateTransactionDbError extends DbErrorAbstract {
  public code: string = 'USER_CREATE_TRANSACTION_DB_ERROR';
  constructor() {
    super(
      `ユーザー作成処理中にエラーが発生しました、しばらく経ってから再度お試しください`
    );
    this.name = this.constructor.name;
  }
}
