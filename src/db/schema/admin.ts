import { int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const admins = mysqlTable('admins', {
    id: int().autoincrement().primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
