"use server";

import { db } from "@/db";
import {
  doctorSchedules,
  DoctorSchedule,
  NewDoctorSchedule,
  WeeklySchedule,
} from "@/db/schema";
import { getUserFromToken } from "@/lib/clientAuth";
import { parseJsonColumn, serializeJsonColumn } from "@/lib/jsonColumns";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

const emptyWeeklySchedule = (): WeeklySchedule => ({
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
});

const toDoctorSchedule = (
  row: typeof doctorSchedules.$inferSelect,
): DoctorSchedule => ({
  ...row,
  weeklySchedule: parseJsonColumn(
    row.weeklySchedule,
    emptyWeeklySchedule(),
  ),
});

export const fetchCurrentSchedule = async () => {
  const currentSchedule = await db.query.doctorSchedules.findFirst({
    orderBy: desc(doctorSchedules.createdAt),
  });

  return currentSchedule ? toDoctorSchedule(currentSchedule) : undefined;
};

export const createNewSchedule = async (data: NewDoctorSchedule) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }

  for (const day of data.weeklySchedule
    ? Object.keys(data.weeklySchedule)
    : []) {
    const i = data.weeklySchedule[day as keyof WeeklySchedule];

    if (!i?.startTime || !i?.endTime || !i?.slotDuration) {
      data = {
        ...data,
        weeklySchedule: {
          ...data.weeklySchedule,
          [day]: {
            startTime: "",
            endTime: "",
            slotDuration: 0,
          },
        },
      };
    }
  }

  const [{ id }] = await db
    .insert(doctorSchedules)
    .values({
      weeklySchedule: serializeJsonColumn(data.weeklySchedule),
      effectiveFrom: data.effectiveFrom,
      effectiveUntil: data.effectiveUntil,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .$returningId();

  const schedule = await db.query.doctorSchedules.findFirst({
    where: eq(doctorSchedules.id, id),
  });

  return { ok: true, data: schedule ? [toDoctorSchedule(schedule)] : [] };
};
