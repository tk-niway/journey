import { UserType } from "@domains/user/types/user.type";
import { z } from 'zod';

export class UserValue {
  constructor(values: UserType) {
    const parsed = UserValue.valueValidator.parse(values);

    this._id = values.id;
    this._name = values.name;
    this._email = values.email;
    this._createdAt = values.createdAt;
    this._updatedAt = values.updatedAt;
    this._values = {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private _id: string;
  private _name: string;
  private _email: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _values: UserType;

  private static valueValidator = z.object({
    id: z.string().min(1, 'Id is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  get values(): UserType {
    return this._values;
  }
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

}