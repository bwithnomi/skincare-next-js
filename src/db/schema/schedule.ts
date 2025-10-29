import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// TypeScript types for type safety
export type BreakTime = {
  startTime: string; // "13:30"
  endTime: string; // "14:30"
};

export type DaySchedule = {
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  slotDuration: number; // in minutes (e.g., 30)
  breaks?: BreakTime[]; // Optional break times during the day
} | null; // null means day off

export type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

// Database schema
export const doctorSchedules = pgTable("doctor_schedules", {
  id: serial().primaryKey(),
  weeklySchedule: jsonb("weekly_schedule").$type<WeeklySchedule>().notNull(),
  effectiveFrom: timestamp("effective_from").notNull().defaultNow(),
  effectiveUntil: timestamp("effective_until"), // null means current schedule
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type DoctorSchedule = typeof doctorSchedules.$inferSelect;
export type NewDoctorSchedule = typeof doctorSchedules.$inferInsert;
