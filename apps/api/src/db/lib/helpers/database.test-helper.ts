import { databaseService } from '@db/database.service';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { sql } from 'drizzle-orm';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '@db/repositories/test/test.repository';
import { UserEntity } from '@domains/user/entities/user.entity';
import { faker } from '@faker-js/faker';

// 全テーブルのリスト（新しいテーブルを追加したらここに追加するだけ）
const allTables = [
  noteTagsTable,
  notesTable,
  tagsTable,
  userCredentialsTable,
  usersTable,
];

/**
 * テスト用にデータベースの全テーブルをクリーンアップする
 * 外部キー制約の順序を考慮して削除
 */
export const cleanupAllTables = async () => {
  // 外部キー制約を一時的に無効化して一括削除
  databaseService.run(sql`PRAGMA foreign_keys = OFF`);

  for (const table of allTables) {
    await databaseService.delete(table);
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
