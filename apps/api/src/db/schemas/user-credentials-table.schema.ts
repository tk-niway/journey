import { usersTable } from '@db/schemas/users-table.schema';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userCredentialsTable = sqliteTable('user_credentials', {
  id: text().primaryKey().notNull(),
  userId: text('user_id')
    .unique()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  hashedPassword: text('hashed_password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const userCredentialsTableRelations = relations(
  userCredentialsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userCredentialsTable.userId],
      references: [usersTable.id],
    }),
  })
);
