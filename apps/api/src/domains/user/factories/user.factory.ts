import { UserEntity } from "@domains/user/entities/user.entity";
import { NewUserType, UserType } from "@domains/user/types/user.type";
import { UserValue } from "@domains/user/values/user.value";
import { nanoid } from "nanoid";

export class UserFactory {
  private constructor() { }

  static createEntity(values: UserType): UserEntity {
    return new UserEntity(new UserValue(values));
  }

  static createNewEntity(values: NewUserType): UserEntity {
    return new UserEntity(this.createNewValue(values));
  }

  private static createNewValue(values: NewUserType): UserValue {
    const id = nanoid();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new UserValue({
      id,
      name: values.name,
      email: values.email,
      createdAt,
      updatedAt,
    });
  }
}