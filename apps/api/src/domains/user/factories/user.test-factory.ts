import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { UserEntity } from '@domains/user/entities/user.entity';
import {
  UserCredentialValue,
  UserCredentialValueArgs,
} from '@domains/user/values/user-credential.value';
import { UserValue, UserValueArgs } from '@domains/user/values/user.value';
import {
  NewUserValueArgs,
  NewUserCredentialValueArgs,
} from '@domains/user/factories/user.factory';

export class UserTestFactory {
  static createUserValue(args: Partial<NewUserValueArgs> = {}): UserValue {
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
    args: Partial<NewUserCredentialValueArgs> = {}
  ): UserCredentialValue {
    const now = new Date();
    const hashedPassword = UserCredentialValue.hashPassword(
      args.plainPassword ?? faker.internet.password()
    );
    const fullArgs: UserCredentialValueArgs = {
      id: args.id ?? nanoid(),
      userId: args.userId ?? nanoid(),
      hashedPassword: hashedPassword,
      createdAt: args.createdAt ?? now,
      updatedAt: args.updatedAt ?? now,
    };
    return new UserCredentialValue(fullArgs);
  }

  static createUserEntity(
    userValueArgs: Partial<NewUserValueArgs> = {},
    userCredentialValueArgs: Partial<NewUserCredentialValueArgs> = {}
  ): UserEntity {
    const userValue = this.createUserValue(userValueArgs);
    const userCredentialValue = this.createUserCredentialValue({
      userId: userValue.values.id,
      ...userCredentialValueArgs,
    });
    return new UserEntity(userValue, userCredentialValue);
  }
}
