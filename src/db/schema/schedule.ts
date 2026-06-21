import { int, mysqlTable, text, timestamp } from "drizzle-orm/mysql-core";

export type BreakTime = {
  startTime: string;
  endTime: string;
};

export type DaySchedule = {
  startTime: string;
  endTime: string;
  slotDuration: number;
  breaks?: BreakTime[];
} | null;

export type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

export const doctorSchedules = mysqlTable("doctor_schedules", {
  id: int().autoincrement().primaryKey(),
  weeklySchedule: text("weekly_schedule").notNull(),
  effectiveFrom: timestamp("effective_from").notNull().defaultNow(),
  effectiveUntil: timestamp("effective_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

type DoctorScheduleRow = typeof doctorSchedules.$inferSelect;
type NewDoctorScheduleRow = typeof doctorSchedules.$inferInsert;

export type DoctorSchedule = Omit<DoctorScheduleRow, "weeklySchedule"> & {
  weeklySchedule: WeeklySchedule;
};
export type NewDoctorSchedule = Omit<
  NewDoctorScheduleRow,
  "weeklySchedule"
> & {
  weeklySchedule: WeeklySchedule;
};
