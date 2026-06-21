import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const blogs = mysqlTable("blogs", {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  author: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
