import { databaseService, DatabaseService } from "@db/database.service";
import { UsersTableRepository } from "@db/users/users-table.repository";
import { UserEntity } from "@domains/user/entities/user.entity";
import { EmailAlreadyExistsError, UserAlreadyExistsError } from "@domains/user/errors/user.error";
import { UserFactory } from "@domains/user/factories/user.factory";
import { UserRepository } from "@domains/user/repositories/user-repository.interface";
import { CreateUserInput } from "@domains/user/types/user.type";

export class UserApplication {
  constructor(dbClient: DatabaseService = databaseService) {
    this.userRepository = new UsersTableRepository(dbClient);
  }

  private userRepository: UserRepository;

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const newUser = UserFactory.createNewEntity(input);

    const existingUser = await this.findUserById(newUser.id);

    if (existingUser) throw new UserAlreadyExistsError(newUser.id);

    const existingEmail = await this.userRepository.findByEmail(input.email);

    if (existingEmail) throw new EmailAlreadyExistsError(input.email);

    return this.userRepository.create(newUser, input.password);
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
}