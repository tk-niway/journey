import { UserEntity } from '@domains/user/entities/user.entity';
import { usersTable } from '@db/schemas/users-table.schema';
import { UserFactory } from '@domains/user/factories/user.factory';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '@db/database.service';
import logger from '@lib/loggers';
import {
  UserListParams,
  UserRepository,
} from '@domains/user/repositories/user-repository.interface';
import {
  UserCredentialCreateDbError,
  UserCreateDbError,
  UserCreateTransactionDbError,
  UserCredentialUpdateDbError,
  UserUpdateDbError,
  UserUpdateTransactionDbError,
} from '@db/repositories/users/users-table.error';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';

export class UsersTableRepository implements UserRepository {
  constructor(private readonly dbClient: DatabaseService) {}

  async findById(id: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
      with: {
        userCredentials: true,
      },
    });
    return user
      ? UserFactory.createUserEntity(user, user.userCredentials)
      : null;
  }

  async findByEmail(email: string) {
    const user = await this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
      with: {
        userCredentials: true,
      },
    });
    return user
      ? UserFactory.createUserEntity(user, user.userCredentials)
      : null;
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const userArgs = userEntity.createUserArgs();
    const credentialArgs = userEntity.createUserCredentialArgs();
    try {
      return this.dbClient.transaction((db) => {
        const createUserResult = db
          .insert(usersTable)
          .values(userArgs)
          .returning()
          .all();

        const createdUser = createUserResult[0];

        if (!createdUser) throw new UserCreateDbError();

        const createCredentialResult = db
          .insert(userCredentialsTable)
          .values(credentialArgs)
          .returning()
          .all();

        const createdCredential = createCredentialResult[0];

        if (!createdCredential) throw new UserCredentialCreateDbError();

        return UserFactory.createUserEntity(createdUser, createdCredential);
      });
    } catch (error) {
      logger.error(
        `${UsersTableRepository.name}:create`,
        `values:${JSON.stringify({ user: userArgs, credential: credentialArgs })}`,
        error
      );
      throw new UserCreateTransactionDbError();
    }
  }

  async update(
    userEntity: UserEntity,
    options: { updateCredential: boolean }
  ): Promise<UserEntity> {
    const userArgs = userEntity.createUserArgs();
    const credentialArgs = userEntity.createUserCredentialArgs();

    try {
      return this.dbClient.transaction((db) => {
        const updateUserResult = db
          .update(usersTable)
          .set({
            name: userArgs.name,
            email: userArgs.email,
            // updatedAt はスキーマの $onUpdate に任せる
          })
          .where(eq(usersTable.id, userArgs.id))
          .returning()
          .all();

        const updatedUser = updateUserResult[0];
        if (!updatedUser) throw new UserUpdateDbError();

        if (!options.updateCredential) {
          return UserFactory.createUserEntity(
            updatedUser,
            userEntity.credential
          );
        }

        const updateCredentialResult = db
          .update(userCredentialsTable)
          .set({
            hashedPassword: credentialArgs.hashedPassword,
            updatedAt: credentialArgs.updatedAt,
          })
          .where(eq(userCredentialsTable.userId, credentialArgs.userId))
          .returning()
          .all();

        const updatedCredential = updateCredentialResult[0];
        if (!updatedCredential) throw new UserCredentialUpdateDbError();

        return UserFactory.createUserEntity(updatedUser, updatedCredential);
      });
    } catch (error) {
      logger.error(
        `${UsersTableRepository.name}:update`,
        `values:${JSON.stringify({
          user: userArgs,
          credential: options.updateCredential ? credentialArgs : undefined,
        })}`,
        error
      );
      throw new UserUpdateTransactionDbError();
    }
  }

  async findMany(params: UserListParams) {
    const users = await this.dbClient.query.usersTable.findMany({
      limit: params.limit,
      offset: params.offset,
      orderBy: (table) => desc(table.createdAt),
    });

    return users.map((user) => UserFactory.createUserValue(user).values);
  }
}
