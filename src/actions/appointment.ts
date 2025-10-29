"use server";

import { db } from "@/db";
import {
  appointments,
  AppointmentStatus,
  NewAppointment,
  PaymentStatus,
} from "@/db/schema/appointment";
import { getUserFromToken } from "@/lib/clientAuth";
import { asc, desc, eq, ne } from "drizzle-orm";
import { cookies } from "next/headers";

export const fetchAppointmentById = async (id: number) => {
  const blog = await db.query.blogs.findFirst({
    where: (appointments, { eq }) => {
      return eq(appointments.id, id);
    },
    orderBy: desc(appointments.createdAt),
  });

  return blog;
};

export const fetchPendingAppointmentByDate = async (date: string) => {
  const appointmentData = await db.query.appointments.findMany({
    where: (appointments, { eq, and }) => {
      return and(
        eq(appointments.checkup_date, date),
        ne(appointments.appointment_status, AppointmentStatus.CANCELLED)
      );
    },
  });

  return appointmentData;
};

export const fetchAppointmentByDate = async (date: string) => {
  const blog = await db.query.appointments.findMany({
    where: (appointments, { eq }) => {
      return eq(appointments.checkup_date, date);
    },
    orderBy: asc(appointments.checkup_slot),
  });

  return blog;
};

export const createAppointment = async (appointment: NewAppointment) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }

  const appointmentData = await db
    .insert(appointments)
    .values({
      ...appointment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return { ok: true, data: appointmentData };
};

export const confirmAppointmentPaymentStatus = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }
  await db
    .update(appointments)
    .set({
      payment_status: PaymentStatus.CONFIRMED,
      appointment_status: AppointmentStatus.CONFIRMED,
    })
    .where(eq(appointments.id, id));
  return { ok: true };
};

export const changeAppointmentStatusById = async (
  id: number,
  status: AppointmentStatus
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }
  await db
    .update(appointments)
    .set({ appointment_status: status })
    .where(eq(appointments.id, id));
  return { ok: true };
};
