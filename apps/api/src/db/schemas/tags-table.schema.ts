import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { relations, sql } from 'drizzle-orm';
import { usersTable } from '@db/schemas/users-table.schema';
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const tagsTable = sqliteTable(
  'tags',
  {
    id: text()
      .$defaultFn(() => nanoid())
      .primaryKey()
      .notNull(),
    name: text({ length: 128 }).notNull(),
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
  },
  (table) => ({
    userIdNameUnique: uniqueIndex('tags_user_id_name_unique').on(
      table.userId,
      table.name
    ),
  })
);

export const tagsTableRelations = relations(tagsTable, ({ many, one }) => ({
  user: one(usersTable, {
    fields: [tagsTable.userId],
    references: [usersTable.id],
  }),
  noteTags: many(noteTagsTable),
}));
