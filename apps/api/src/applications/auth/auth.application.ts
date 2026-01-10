import { databaseService, DatabaseService } from '@db/database.service';
import { UserFactory } from '@domains/user/factories/user.factory';
import {
  UserAlreadyExistsError,
  EmailAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
} from '@domains/user/errors/user.error';
import { UserRepository } from '@domains/user/repositories/user-repository.interface';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';

export class AuthApplication {
  constructor(dbService: DatabaseService = databaseService) {
    this.userRepository = new UsersTableRepository(dbService);
  }

  private userRepository: UserRepository;

  async signup(input: { name: string; email: string; password: string }) {
    const newUserValue = UserFactory.createNewUserValue(input);
    const existingUser = await this.userRepository.findById(
      newUserValue.values.id
    );
    if (existingUser) throw new UserAlreadyExistsError(newUserValue.values.id);
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) throw new EmailAlreadyExistsError(input.email);
    const credentialValue = UserFactory.createNewUserCredentialValue({
      userId: newUserValue.values.id,
      plainPassword: input.password,
    });
    const newUserEntity = UserFactory.createUserEntity(
      newUserValue,
      credentialValue
    );
    return this.userRepository.create(newUserEntity);
  }

  async login(email: string, password: string) {
    const userEntity = await this.userRepository.findByEmail(email);
    if (!userEntity) throw new UserNotFoundError(email);
    if (!userEntity.verifyPassword(password)) throw new InvalidPasswordError();
    return userEntity;
  }
}
