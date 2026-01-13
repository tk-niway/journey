import { DbErrorAbstract } from '@lib/errors/db-error.abstract';

export class NoteCreateDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(`ノート作成に失敗しました、しばらく経ってから再度お試しください`);
    this.name = this.constructor.name;
  }
}

export class NoteCreateTransactionDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(
      `ノート作成処理中にエラーが発生しました、しばらく経ってから再度お試しください`
    );
    this.name = this.constructor.name;
  }
}

export class NoteUpdateTransactionDbError extends DbErrorAbstract {
  code = undefined;
  constructor() {
    super(
      `ノート更新処理中にエラーが発生しました、しばらく経ってから再度お試しください`
    );
    this.name = this.constructor.name;
  }
}
