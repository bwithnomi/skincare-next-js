import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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

export const  paymentStatusEnum = pgEnum("payment_status", PaymentStatus);

export const  appointmentStatusEnum = pgEnum("appointment_status", AppointmentStatus);

export const appointments = pgTable("appointments", {
  id: serial().primaryKey(),
  email: text().notNull().references(() => users.email),
  patient: text().notNull(),
  issue: text().notNull(),
  consultation_type: text().notNull(),
  checkup_date: text().notNull(),
  checkup_slot: text().notNull(),
  payment_status: paymentStatusEnum().default(PaymentStatus.PENDING).notNull(),
  appointment_status: appointmentStatusEnum().default(AppointmentStatus.PENDING).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export const appointmentRealtions = relations(appointments, ({one}) => ({
    user: one(users, { fields: [appointments.email], references: [users.email] }),
}));
