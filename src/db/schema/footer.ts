import { int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const footer = mysqlTable('footer', {
    id: int().autoincrement().primaryKey(),
    address: text().default("Address"),
    email: varchar({ length: 255 }).default("email"),
    phone: varchar({ length: 50 }).default("phone"),
    facebook: varchar({ length: 255 }).default("#"),
    linkedin: varchar({ length: 255 }).default("#"),
    instagram: varchar({ length: 255 }).default("#"),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Footer = typeof footer.$inferSelect;
export type NewFooter = typeof footer.$inferInsert;
