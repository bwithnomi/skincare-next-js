import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { appointments } from './appointment';

export const users = pgTable('users', {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    whatsapp: text().default(""),
    phone: text().notNull(),
    password: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRealtions = relations(users, ({many}) => ({
    appointments: many(appointments),
}));

