import {
  UserCredentialValue,
  UserCredentialValueObject,
} from '@domains/user/values/user-credential.value';
import { UserValue, UserValueObject } from '@domains/user/values/user.value';

export class UserEntity {
  constructor(values: UserValue, userCredentialValue: UserCredentialValue) {
    this._userValues = values;
    this._userCredentialValue = userCredentialValue;
  }

  private _userValues: UserValue;
  private _userCredentialValue: UserCredentialValue;

  get values(): UserValueObject {
    return this._userValues.values;
  }

  get credential(): UserCredentialValueObject {
    return this._userCredentialValue.values;
  }

  createUserArgs() {
    return this.values;
  }

  createUserCredentialArgs() {
    return {
      ...this.credential,
      userId: this.values.id,
    };
  }

  verifyPassword(password: string): boolean {
    return this._userCredentialValue.verifyPassword(password);
  }
}
