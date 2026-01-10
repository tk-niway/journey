import { UserEntity } from '@domains/user/entities/user.entity';
import {
  UserCredentialValueArgs,
  UserCredentialValue,
} from '@domains/user/values/user-credential.value';
import { UserValue, UserValueArgs } from '@domains/user/values/user.value';
import { nanoid } from 'nanoid';

export type NewUserValueArgs = {
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewUserCredentialValueArgs = {
  userId: string;
  plainPassword: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserFactory {
  private constructor() {}

  static createUserValue(values: UserValueArgs): UserValue {
    return new UserValue(values);
  }

  static createUserCredentialValue(
    values: UserCredentialValueArgs
  ): UserCredentialValue {
    return new UserCredentialValue(values);
  }

  static createNewUserValue(values: NewUserValueArgs): UserValue {
    const id = nanoid();
    const createdAt = values.createdAt || new Date();
    const updatedAt = values.updatedAt || new Date();
    return new UserValue({
      id,
      name: values.name,
      email: values.email,
      createdAt,
      updatedAt,
    });
  }

  static createNewUserCredentialValue(
    values: NewUserCredentialValueArgs
  ): UserCredentialValue {
    const id = nanoid();
    const hashedPassword = UserCredentialValue.hashPassword(
      values.plainPassword
    );
    const createdAt = values.createdAt || new Date();
    const updatedAt = values.updatedAt || new Date();
    return new UserCredentialValue({
      id,
      userId: values.userId,
      hashedPassword: hashedPassword,
      createdAt,
      updatedAt,
    });
  }

  static createUserEntity(
    values: UserValueArgs,
    userCredentialValues: UserCredentialValueArgs
  ): UserEntity;
  static createUserEntity(
    values: UserValue,
    userCredentialValues: UserCredentialValue
  ): UserEntity;
  static createUserEntity(
    values: UserValue | UserValueArgs,
    userCredentialValues: UserCredentialValue | UserCredentialValueArgs
  ): UserEntity {
    const userValue =
      values instanceof UserValue ? values : this.createUserValue(values);

    const userCredentialValue =
      userCredentialValues instanceof UserCredentialValue
        ? userCredentialValues
        : this.createUserCredentialValue(userCredentialValues);

    return new UserEntity(userValue, userCredentialValue);
  }
}
