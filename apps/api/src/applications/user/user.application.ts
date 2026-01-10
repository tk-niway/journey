import { databaseService, DatabaseService } from "@db/database.service";
import { UsersTableRepository } from "@db/users/users-table.repository";
import { UserEntity } from "@domains/user/entities/user.entity";
import { UserRepository } from "@domains/user/repositories/user-repository.interface";

export class UserApplication {
  constructor(dbClient: DatabaseService = databaseService) {
    this.userRepository = new UsersTableRepository(dbClient);
  }

  private userRepository: UserRepository;

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
}