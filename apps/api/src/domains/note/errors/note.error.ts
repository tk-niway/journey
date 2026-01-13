import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';

export class NoteNotFoundError extends DomainErrorAbstract {
  code = undefined;
  constructor(noteId: string) {
    super(`ノートが見つかりませんでした id:${noteId}`);
    this.name = this.constructor.name;
  }
}
