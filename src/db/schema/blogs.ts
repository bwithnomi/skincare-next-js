import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: serial().primaryKey(),
  title: text().notNull(),
  author: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
