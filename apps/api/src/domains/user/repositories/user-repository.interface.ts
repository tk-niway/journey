import { UserEntity } from '@domains/user/entities/user.entity';
import { UserValueObject } from '@domains/user/values/user.value';

export type UserListParams = {
  limit: number;
  offset: number;
};

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userEntity: UserEntity): Promise<UserEntity>;
  update(
    userEntity: UserEntity,
    options: { updateCredential: boolean }
  ): Promise<UserEntity>;
  findMany(params: UserListParams): Promise<UserValueObject[]>;
}
