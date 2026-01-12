import { DatabaseService, databaseService } from '@db/database.service';
import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { UserEntity } from '@domains/user/entities/user.entity';
import { eq } from 'drizzle-orm';

/**
 * テスト用のDB操作をまとめたリポジトリ
 * テストコードでのみ使用する
 */
export class TestRepository {
  constructor(private readonly dbClient: DatabaseService = databaseService) {}

  /**
   * テスト用ユーザーをDBに作成する
   * usersテーブルとuser_credentialsテーブルに挿入
   */
  async createUser(userEntity: UserEntity): Promise<void> {
    await this.dbClient.insert(usersTable).values({
      ...userEntity.values,
    });
    await this.dbClient.insert(userCredentialsTable).values({
      ...userEntity.credential,
    });
  }

  /**
   * メールアドレスでユーザーを検索する
   */
  async findUserByEmail(email: string) {
    return this.dbClient.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  /**
   * テスト用ノートをDBに作成する
   * notes / tags / note_tags テーブルに挿入
   */
  async createNote(noteEntity: NoteEntity): Promise<void> {
    await this.dbClient.insert(notesTable).values(noteEntity.values);

    const tags = noteEntity.tags;
    if (tags.length > 0) {
      await this.dbClient.insert(tagsTable).values(tags);
      await this.dbClient
        .insert(noteTagsTable)
        .values(noteEntity.createNoteTagArgs());
    }
  }
}

// シングルトンインスタンス
export const testRepository = new TestRepository();
