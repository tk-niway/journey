import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { UserEntity } from '@domains/user/entities/user.entity';
import {
  UserCredentialValueArgs,
  UserCredentialValue,
} from '@domains/user/values/user-credential.value';
import { UserValueArgs, UserValue } from '@domains/user/values/user.value';

export class UserTestFactory {
  static createUserValue(args: Partial<UserValueArgs> = {}): UserValue {
    const now = new Date();
    const fullArgs: UserValueArgs = {
      id: args.id ?? nanoid(),
      name: args.name ?? faker.person.fullName(),
      email: args.email ?? faker.internet.email(),
      createdAt: args.createdAt ?? now,
      updatedAt: args.updatedAt ?? now,
    };
    return new UserValue(fullArgs);
  }

  static createUserCredentialValue(
    args: Partial<UserCredentialValueArgs> = {}
  ): UserCredentialValue {
    const now = new Date();
    const fullArgs: UserCredentialValueArgs = {
      id: args.id ?? nanoid(),
      userId: args.userId ?? nanoid(),
      hashedPassword:
        args.hashedPassword ??
        UserCredentialValue.hashPassword(faker.internet.password()),
      createdAt: args.createdAt ?? now,
      updatedAt: args.updatedAt ?? now,
    };
    return new UserCredentialValue(fullArgs);
  }

  static createUserEntity(
    userValueArgs: Partial<UserValueArgs> = {},
    userCredentialValueArgs: Partial<UserCredentialValueArgs> = {}
  ): UserEntity {
    const userValue = this.createUserValue(userValueArgs);
    const userCredentialValue = this.createUserCredentialValue({
      userId: userValue.values.id,
      ...userCredentialValueArgs,
    });
    return new UserEntity(userValue, userCredentialValue);
  }
}
