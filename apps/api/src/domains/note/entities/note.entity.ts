import { NoteValue, NoteValueObject } from '@domains/note/values/note.value';
import { TagValue, TagValueObject } from '@domains/note/values/tag.value';

/**
 * Note集約のルート
 * Tag は Note に集約され、NoteEntity の内部状態として保持する
 */
export class NoteEntity {
  constructor(noteValue: NoteValue, tagValues: TagValue[] = []) {
    this._noteValue = noteValue;
    this._tagValues = tagValues;
  }

  private _noteValue: NoteValue;
  private _tagValues: TagValue[];

  get values(): NoteValueObject {
    return this._noteValue.values;
  }

  get tags(): TagValueObject[] {
    return this._tagValues.map((tag) => tag.values);
  }

  createNoteArgs(): NoteValueObject {
    return this.values;
  }

  createTagArgs(): TagValueObject[] {
    return this.tags;
  }

  /**
   * note_tags 用のリンク情報を生成する
   * note_tags 側の id/createdAt/updatedAt はDB側のdefaultで生成する想定
   */
  createNoteTagArgs(): Array<{ noteId: string; tagId: string }> {
    return this.tags.map((tag) => ({
      noteId: this.values.id,
      tagId: tag.id,
    }));
  }
}
