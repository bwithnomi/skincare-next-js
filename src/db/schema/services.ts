import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: serial().primaryKey(),
  title: text().notNull(),
  sub_categories: jsonb("sub_categories").$type<string[]>().notNull(),
  status: text().notNull().default("active"),
  link: text().default("#"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
