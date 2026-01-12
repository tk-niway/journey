import { DbErrorAbstract } from '@lib/errors/db-error.abstract';

export class UserCreateDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(`ユーザー作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserCredentialCreateDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(`認証情報登録に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class UserCreateTransactionDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(
      `ユーザー作成処理中にエラーが発生しました、しばらく経ってから再度お試しください`
    );
    this.name = this.constructor.name;
  }
}
