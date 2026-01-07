import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const usersTable = sqliteTable("users", {
  id: text().$defaultFn(() => nanoid()).primaryKey().notNull(),
  name: text({ length: 128 }).notNull(),
  email: text({ length: 128 }).notNull().unique(),
  password: text({ length: 128 }).notNull(),
  created_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const notesTable = sqliteTable("notes", {
  id: text().$defaultFn(() => nanoid()).primaryKey().notNull(),
  title: text({ length: 128 }).notNull(),
  content: text({ length: 20000 }).notNull(),
  userId: text().references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  created_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const tagsTable = sqliteTable("tags", {
  id: text().$defaultFn(() => nanoid()).primaryKey().notNull(),
  name: text({ length: 128 }).notNull(),
  created_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const noteTagsTable = sqliteTable("note_tags", {
  id: text().$defaultFn(() => nanoid()).primaryKey().notNull(),
  noteId: text().references(() => notesTable.id, { onDelete: 'cascade' }).notNull(),
  tagId: text().references(() => tagsTable.id).notNull(),
  created_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});