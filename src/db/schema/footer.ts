import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const footer = pgTable('footer', {
    id: serial().primaryKey(),
    address: text().default("Address"),
    email: text().default("email"),
    phone: text().default("phone"),
    facebook: text().default("#"),
    linkedin: text().default("#"),
    instagram: text().default("#"),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Footer = typeof footer.$inferSelect;
export type NewFooter = typeof footer.$inferInsert;

