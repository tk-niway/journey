import { drizzle } from 'drizzle-orm/better-sqlite3';
import {
  usersTable,
  usersTableRelations,
} from '@db/schemas/users-table.schema';
import env from '@consts/env';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import {
  userCredentialsTable,
  userCredentialsTableRelations,
} from '@db/schemas/user-credentials-table.schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import {
  notesTable,
  notesTableRelations,
} from '@db/schemas/notes-table.schema';
import {
  noteTagsTable,
  noteTagsTableRelations,
} from '@db/schemas/note-tags-table.schema';
import { tagsTable, tagsTableRelations } from '@db/schemas/tags-table.schema';

const schema = {
  usersTable,
  userCredentialsTable,
  usersTableRelations,
  userCredentialsTableRelations,
  notesTable,
  tagsTable,
  noteTagsTable,
  notesTableRelations,
  tagsTableRelations,
  noteTagsTableRelations,
};

// データベースファイルのパス
const DB_PATH = env.DB_FILE_NAME;

export type DatabaseService = BetterSQLite3Database<typeof schema>;

const createTestDatabase = (): DatabaseService => {
  const conn = new Database(':memory:');
  const db = drizzle(conn, { schema });
  migrate(db, { migrationsFolder: './drizzle' });
  return db;
};

// 本番/開発環境用のデータベース作成関数
const createProductionDatabase = (): DatabaseService => {
  const globalForDb = globalThis as unknown as {
    conn: Database.Database | undefined;
  };
  const conn = globalForDb.conn ?? new Database(DB_PATH);
  conn.pragma('journal_mode = WAL');
  return drizzle(conn, { schema });
};

export const databaseService: DatabaseService =
  env.NODE_ENV === 'test' ? createTestDatabase() : createProductionDatabase();

// const schema = { usersTable };
// export type DatabaseService = BetterSQLite3Database<typeof schema>;
// export const databaseService:DatabaseService = drizzle(DB_PATH, { schema });

// 以下は複数コネクションの時に良いらしいが今は使わない
// グローバルスコープにキャッシュ用の変数を定義（TypeScript用）
// これにより、開発中の再読み込み時でも接続を保持できます
// const globalForDb = globalThis as unknown as {
//   conn: Database.Database | undefined;
// };

// データベース接続（ドライバ）の作成
// 既に接続があればそれを使い、なければ新規作成
// const conn = globalForDb.conn ?? new Database(DB_PATH);

// WALモードを有効化（重要: Webアプリでの並行処理性能が向上します）
// conn.pragma('journal_mode = WAL');

// if (process.env.NODE_ENV !== 'production') {
//   globalForDb.conn = conn;
// }

// Drizzleのインスタンス化
// { schema } を渡すことで、クエリ作成時に型推論が効くようになります
