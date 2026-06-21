import { int, json, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const services = mysqlTable("services", {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  sub_categories: json("sub_categories").$type<string[]>().notNull(),
  status: varchar({ length: 50 }).notNull().default("active"),
  link: varchar({ length: 255 }).default("#"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
