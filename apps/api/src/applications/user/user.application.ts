import { databaseService, DatabaseServiceType } from "@db/service";
import { UsersRepository } from "@db/users/users.repository";
import { UserEntity } from "@domains/user/entities/user.entity";
import { UserFactory } from "@domains/user/factories/user.factory";
import { CreateUserInput } from "@domains/user/types/user.type";

export class UserApplication {
  constructor(dbClient: DatabaseServiceType = databaseService) {
    this.userRepository = new UsersRepository(dbClient);
  }

  private userRepository: UsersRepository;

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const newUser = UserFactory.createNewEntity(input);

    const existingUser = await this.findUserById(newUser.id);

    if (existingUser) throw new Error("User already exists");

    return this.userRepository.create(newUser, input.password);
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
}