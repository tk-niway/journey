import { databaseService, DatabaseService } from '@db/database.service';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';
import { UserEntity } from '@domains/user/entities/user.entity';
import { UserFactory } from '@domains/user/factories/user.factory';
import {
  EmailAlreadyExistsError,
  InvalidPasswordError,
  UserNotFoundByIdError,
} from '@domains/user/errors/user.error';
import { UserRepository } from '@domains/user/repositories/user-repository.interface';
import { UserValueObject } from '@domains/user/values/user.value';

type UpdateUserInput = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

type ListUsersInput = {
  limit: number;
  offset: number;
};

export class UserApplication {
  constructor(dbClient: DatabaseService = databaseService) {
    this.userRepository = new UsersTableRepository(dbClient);
  }

  private userRepository: UserRepository;

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async listUsers(params: ListUsersInput): Promise<UserValueObject[]> {
    return this.userRepository.findMany(params);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<UserEntity> {
    const userEntity = await this.userRepository.findById(id);
    if (!userEntity) throw new UserNotFoundByIdError(id);

    if (input.email && input.email !== userEntity.values.email) {
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser && existingUser.values.id !== id) {
        throw new EmailAlreadyExistsError(input.email);
      }
    }

    if (input.newPassword) {
      if (!input.currentPassword) throw new InvalidPasswordError();
      if (!userEntity.verifyPassword(input.currentPassword)) {
        throw new InvalidPasswordError();
      }
    }

    const updatedUserValue = UserFactory.createUserValue({
      ...userEntity.values,
      name: input.name ?? userEntity.values.name,
      email: input.email ?? userEntity.values.email,
      updatedAt: new Date(),
    });

    const updatedCredentialValue = input.newPassword
      ? UserFactory.createUpdatedUserCredentialValue({
          current: userEntity.credential,
          plainPassword: input.newPassword,
        })
      : UserFactory.createUserCredentialValue(userEntity.credential);

    const updatedUserEntity = UserFactory.createUserEntity(
      updatedUserValue,
      updatedCredentialValue
    );

    return this.userRepository.update(updatedUserEntity, {
      updateCredential: !!input.newPassword,
    });
  }
}
