import { UserEntity } from '@domains/user/entities/user.entity';
import { usersTable } from '@db/users/users-table.schema';
import { UserFactory } from '@domains/user/factories/user.factory';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '@db/database.service';
import logger from '@lib/logger';
import { UserRepository } from '@domains/user/repositories/user-repository.interface';
import {
  UserCredentialCreateError,
  UserTableCreateError,
  UserTableCreateTransactionError,
} from '@db/users/users-table.error';
import { userCredentialsTable } from '@db/user-credentials/user-credentials-table.schema';

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

        if (!createdUser) throw new UserTableCreateError();

        const createCredentialResult = db
          .insert(userCredentialsTable)
          .values(credentialArgs)
          .returning()
          .all();

        const createdCredential = createCredentialResult[0];

        if (!createdCredential) throw new UserCredentialCreateError();

        return UserFactory.createUserEntity(createdUser, createdCredential);
      });
    } catch (error) {
      logger.error(
        `${UsersTableRepository.name}:create`,
        `values:${JSON.stringify({ user: userArgs, credential: credentialArgs })}`,
        error
      );
      throw new UserTableCreateTransactionError();
    }
  }
}
