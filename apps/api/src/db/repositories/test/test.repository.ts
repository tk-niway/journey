import { DatabaseService, databaseService } from '@db/database.service';
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
}

// シングルトンインスタンス
export const testRepository = new TestRepository();
