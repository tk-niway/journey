import { databaseService } from '@db/database.service';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { sql } from 'drizzle-orm';

// 全テーブルのリスト（新しいテーブルを追加したらここに追加するだけ）
const allTables = [userCredentialsTable, usersTable];

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
