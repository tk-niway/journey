import { z } from 'zod';

export interface NoteValueObject {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteValueArgs = NoteValueObject;

export class NoteValue {
  constructor(values: NoteValueArgs) {
    this._values = this.valueValidator(values);
  }

  private _values: NoteValueObject;

  private valueValidator(values: NoteValueArgs): NoteValueObject {
    return z
      .object({
        id: z.string().min(1, 'Id is required'),
        title: z
          .string()
          .min(1, 'Title is required')
          .max(128, 'Title is too long'),
        content: z
          .string()
          .min(1, 'Content is required')
          .max(20000, 'Content is too long'),
        userId: z.string().min(1, 'User ID is required'),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .strip()
      .parse(values);
  }

  get values(): NoteValueObject {
    return this._values;
  }
}
