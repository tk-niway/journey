import { UserEntity } from "@domains/user/entities/user.entity";
import { UserRepository } from "@domains/user/repositories/user.repository";
import { usersTable } from "@db/users/users.schema";
import { UserFactory } from "@domains/user/factories/user.factory";
import { eq } from "drizzle-orm";
import { DatabaseService } from "@db/service";
import { UserCreateError } from "@db/users/users.error";
import logger from "@lib/logger";

export class UsersRepository implements UserRepository {

  constructor(private readonly dbClient: DatabaseService) { }

  async findById(id: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });

    return user ? UserFactory.createEntity(user) : null;
  }

  async findByEmail(email: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    return user ? UserFactory.createEntity(user) : null;
  }

  async findMany(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }

  async create(userEntity: UserEntity, password: string): Promise<UserEntity> {
    try {
      const result = await this.dbClient.insert(usersTable).values(
        userEntity.createUserArgs(password),
      ).returning();

      const createdUser = result[0];

      if (!createdUser) throw new Error();

      return UserFactory.createEntity(createdUser);

    } catch (error) {
      logger.error(`${UserCreateError.name}:create`, error);
      throw new UserCreateError();
    }
  }


  async update(userEntity: UserEntity): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  async delete(userEntity: UserEntity): Promise<void> {
    throw new Error("Method not implemented.");
  };
};