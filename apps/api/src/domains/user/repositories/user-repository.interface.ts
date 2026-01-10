import { UserEntity } from '@domains/user/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userEntity: UserEntity): Promise<UserEntity>;
}
