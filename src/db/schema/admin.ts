import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', {
    id: serial().primaryKey(),
    email: text().notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

