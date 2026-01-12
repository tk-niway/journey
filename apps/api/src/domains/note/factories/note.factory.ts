import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteValue, NoteValueArgs } from '@domains/note/values/note.value';
import { TagValue, TagValueArgs } from '@domains/note/values/tag.value';
import { nanoid } from 'nanoid';

export type NewNoteValueArgs = {
  id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewTagValueArgs = {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const uniqById = <T extends { id: string }>(values: T[]): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const value of values) {
    if (seen.has(value.id)) continue;
    seen.add(value.id);
    result.push(value);
  }
  return result;
};

export class NoteFactory {
  private constructor() {}

  static createNoteValue(values: NoteValueArgs): NoteValue {
    return new NoteValue(values);
  }

  static createTagValue(values: TagValueArgs): TagValue {
    return new TagValue(values);
  }

  static createNewNoteValue(values: NewNoteValueArgs): NoteValue {
    const id = values.id || nanoid();
    const createdAt = values.createdAt || new Date();
    const updatedAt = values.updatedAt || new Date();
    return new NoteValue({
      id,
      title: values.title,
      content: values.content,
      userId: values.userId,
      createdAt,
      updatedAt,
    });
  }

  static createNewTagValue(values: NewTagValueArgs): TagValue {
    const id = values.id || nanoid();
    const createdAt = values.createdAt || new Date();
    const updatedAt = values.updatedAt || new Date();
    return new TagValue({
      id,
      name: values.name,
      createdAt,
      updatedAt,
    });
  }

  static createNoteEntity(
    values: NoteValueArgs,
    tags?: TagValueArgs[]
  ): NoteEntity;
  static createNoteEntity(values: NoteValue, tags?: TagValue[]): NoteEntity;
  static createNoteEntity(
    values: NoteValue | NoteValueArgs,
    tags: Array<TagValue | TagValueArgs> = []
  ): NoteEntity {
    const noteValue =
      values instanceof NoteValue ? values : this.createNoteValue(values);

    const tagValues = tags.map((tag) =>
      tag instanceof TagValue ? tag : this.createTagValue(tag)
    );

    const normalizedTags = uniqById(tagValues.map((tag) => tag.values)).map(
      (tag) => this.createTagValue(tag)
    );

    return new NoteEntity(noteValue, normalizedTags);
  }
}
