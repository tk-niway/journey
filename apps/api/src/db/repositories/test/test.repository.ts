import { DatabaseService, databaseService } from '@db/database.service';
import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';
import { UserEntity } from '@domains/user/entities/user.entity';
import { and, eq, inArray } from 'drizzle-orm';

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

    const userId = noteEntity.values.userId;
    const tagNames = Array.from(
      new Set(noteEntity.tags.map((tag) => tag.name))
    );
    if (tagNames.length === 0) return;

    await this.dbClient
      .insert(tagsTable)
      .values(tagNames.map((name) => ({ name, userId })))
      .onConflictDoNothing({ target: [tagsTable.userId, tagsTable.name] });

    const tags = await this.dbClient
      .select()
      .from(tagsTable)
      .where(
        and(eq(tagsTable.userId, userId), inArray(tagsTable.name, tagNames))
      );

    await this.dbClient.insert(noteTagsTable).values(
      tags.map((tag) => ({
        noteId: noteEntity.values.id,
        tagId: tag.id,
      }))
    );
  }
}

// シングルトンインスタンス
export const testRepository = new TestRepository();
