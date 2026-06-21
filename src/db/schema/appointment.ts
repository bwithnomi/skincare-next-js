import { relations } from "drizzle-orm";
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";

export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  RESHEDULED = "resheduled",
}

export const paymentStatusEnum = mysqlEnum("payment_status", [
  PaymentStatus.PENDING,
  PaymentStatus.CONFIRMED,
  PaymentStatus.CANCELLED,
]);

export const appointmentStatusEnum = mysqlEnum("appointment_status", [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.RESHEDULED,
]);

export const appointments = mysqlTable("appointments", {
  id: int().autoincrement().primaryKey(),
  email: varchar({ length: 255 }).notNull().references(() => users.email),
  patient: varchar({ length: 255 }).notNull(),
  issue: text().notNull(),
  consultation_type: varchar({ length: 255 }).notNull(),
  checkup_date: varchar({ length: 50 }).notNull(),
  checkup_slot: varchar({ length: 50 }).notNull(),
  payment_status: paymentStatusEnum.default(PaymentStatus.PENDING).notNull(),
  appointment_status: appointmentStatusEnum.default(AppointmentStatus.PENDING).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export const appointmentRealtions = relations(appointments, ({one}) => ({
    user: one(users, { fields: [appointments.email], references: [users.email] }),
}));
