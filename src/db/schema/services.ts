import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const services = mysqlTable("services", {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  sub_categories: text("sub_categories").notNull(),
  status: varchar({ length: 50 }).notNull().default("active"),
  link: varchar({ length: 255 }).default("#"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

type ServiceRow = typeof services.$inferSelect;
type NewServiceRow = typeof services.$inferInsert;

export type Service = Omit<ServiceRow, "sub_categories"> & {
  sub_categories: string[];
};
export type NewService = Omit<NewServiceRow, "sub_categories"> & {
  sub_categories: string[];
};
