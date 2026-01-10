import { usersTable } from '@db/users/users-table.schema';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const notesTable = sqliteTable('notes', {
  id: text()
    .$defaultFn(() => nanoid())
    .primaryKey()
    .notNull(),
  title: text({ length: 128 }).notNull(),
  content: text({ length: 20000 }).notNull(),
  userId: text()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});
