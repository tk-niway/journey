import { UserEntity } from "@domains/user/entities/user.entity";

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null> | UserEntity | null;
  findByEmail(email: string): Promise<UserEntity | null> | UserEntity | null;
  findMany(): Promise<UserEntity[]> | UserEntity[];
  create(userEntity: UserEntity, password: string): Promise<UserEntity> | UserEntity;
  update(userEntity: UserEntity): Promise<UserEntity> | UserEntity;
  delete(userEntity: UserEntity): Promise<void> | void;
}