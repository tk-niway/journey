import { z } from 'zod';

export interface UserValueObject {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserValueArgs = UserValueObject;

export class UserValue {
  constructor(values: UserValueArgs) {
    this._values = this.valueValidator(values);
  }

  private _values: UserValueObject;

  private valueValidator(values: UserValueArgs): UserValueObject {
    return z
      .object({
        id: z.string().min(1, 'Id is required'),
        name: z.string().min(1, 'Name is required'),
        email: z.email('Invalid email'),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .strip()
      .parse(values);
  }

  get values(): UserValueObject {
    return this._values;
  }
}
