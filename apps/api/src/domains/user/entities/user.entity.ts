import { UserType } from "@domains/user/types/user.type";
import { UserValue } from "@domains/user/values/user.value";

export class UserEntity {
  constructor(values: UserValue) {
    this._values = values;
  }

  private _values: UserValue;

  get values(): UserType {
    return this._values.values;
  }
  get id(): string {
    return this._values.id;
  }
  get name(): string {
    return this._values.name;
  }
  get email(): string {
    return this._values.email;
  }
  get createdAt(): Date {
    return this._values.createdAt;
  }
  get updatedAt(): Date {
    return this._values.updatedAt;
  }

  createUserArgs(password: string) {
    return {
      ...this.values,
      password,
    };
  }

}