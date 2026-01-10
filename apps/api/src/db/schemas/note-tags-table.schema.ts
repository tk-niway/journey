import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const noteTagsTable = sqliteTable('note_tags', {
  id: text()
    .$defaultFn(() => nanoid())
    .primaryKey()
    .notNull(),
  noteId: text()
    .references(() => notesTable.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: text()
    .references(() => tagsTable.id)
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});
