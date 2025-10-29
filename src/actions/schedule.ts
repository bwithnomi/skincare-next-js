"use server";

import { db } from "@/db";
import {
  doctorSchedules,
  NewDoctorSchedule,
  WeeklySchedule,
} from "@/db/schema";
import { getUserFromToken } from "@/lib/clientAuth";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const fetchCurrentSchedule = async () => {
  const currentSchedule = await db.query.doctorSchedules.findFirst({
    orderBy: desc(doctorSchedules.createdAt),
  });

  return currentSchedule;
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

  const blog = await db
    .insert(doctorSchedules)
    .values({
      ...data,
      id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return { ok: true, data: blog };
};
