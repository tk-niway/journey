import { databaseService } from '@db/database.service';
import { sql } from 'drizzle-orm';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '@db/repositories/test/test.repository';
import { UserEntity } from '@domains/user/entities/user.entity';
import { faker } from '@faker-js/faker';

// テーブル名のリスト（テーブルオブジェクトと対応）
const tableNames = ['note_tags', 'notes', 'tags', 'user_credentials', 'users'];

/**
 * テスト用にデータベースの全テーブルをクリーンアップする
 * 外部キー制約の順序を考慮して削除
 */
export const cleanupAllTables = async () => {
  // 外部キー制約を一時的に無効化して一括削除
  databaseService.run(sql`PRAGMA foreign_keys = OFF`);

  // テーブル名を直接指定して全行削除
  for (const tableName of tableNames) {
    databaseService.run(sql.raw(`DELETE FROM ${tableName}`));
  }

  databaseService.run(sql`PRAGMA foreign_keys = ON`);
};

/**
 * テスト用ユーザーをDBに作成するヘルパー関数
 */
export const createTestUser = async (args: {
  email: string;
  password: string;
  name?: string;
}): Promise<UserEntity> => {
  const userEntity = UserTestFactory.createUserEntity(
    { email: args.email, name: args.name ?? faker.person.fullName() },
    { plainPassword: args.password }
  );
  await testRepository.createUser(userEntity);
  return userEntity;
};
