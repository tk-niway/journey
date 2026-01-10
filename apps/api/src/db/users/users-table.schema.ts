import { userCredentialsTable } from '@db/user-credentials/user-credentials-table.schema';
import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text().primaryKey().notNull(),
  name: text({ length: 128 }).notNull(),
  email: text({ length: 128 }).notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const usersTableRelations = relations(usersTable, ({ one }) => ({
  userCredentials: one(userCredentialsTable, {
    fields: [usersTable.id],
    references: [userCredentialsTable.userId],
  }),
}));
