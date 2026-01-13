import { z } from 'zod';

export interface TagValueObject {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TagValueArgs = TagValueObject;

export class TagValue {
  constructor(values: TagValueArgs) {
    this._values = this.valueValidator(values);
  }

  private _values: TagValueObject;

  private valueValidator(values: TagValueArgs): TagValueObject {
    return z
      .object({
        id: z.string().min(1, 'Id is required'),
        name: z
          .string()
          .min(1, 'Name is required')
          .max(128, 'Name is too long'),
        userId: z.string().min(1, 'User ID is required'),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .strip()
      .parse(values);
  }

  get values(): TagValueObject {
    return this._values;
  }
}
