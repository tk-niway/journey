import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text().primaryKey().notNull(),
  name: text({ length: 128 }).notNull(),
  email: text({ length: 128 }).notNull().unique(),
  password: text({ length: 128 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
}, (table) => [
  t.uniqueIndex("email_idx").on(table.email),
]);