import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { appointments } from './appointment';

export const users = mysqlTable('users', {
    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    whatsapp: varchar({ length: 50 }).default(""),
    phone: varchar({ length: 50 }).notNull(),
    password: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRealtions = relations(users, ({many}) => ({
    appointments: many(appointments),
}));
