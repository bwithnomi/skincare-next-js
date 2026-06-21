"use server";

import { db } from "@/db";
import {
  appointments,
  AppointmentStatus,
  NewAppointment,
  PaymentStatus,
} from "@/db/schema/appointment";
import { users } from "@/db/schema/users";
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
  const rows = await db
    .select({
      id: appointments.id,
      email: appointments.email,
      patient: appointments.patient,
      issue: appointments.issue,
      consultation_type: appointments.consultation_type,
      checkup_date: appointments.checkup_date,
      checkup_slot: appointments.checkup_slot,
      payment_status: appointments.payment_status,
      appointment_status: appointments.appointment_status,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      userPhone: users.phone,
      userWhatsapp: users.whatsapp,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.email, users.email))
    .where(eq(appointments.checkup_date, date))
    .orderBy(asc(appointments.checkup_slot));

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    patient: row.patient,
    issue: row.issue,
    consultation_type: row.consultation_type,
    checkup_date: row.checkup_date,
    checkup_slot: row.checkup_slot,
    payment_status: row.payment_status,
    appointment_status: row.appointment_status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user:
      row.userPhone != null || row.userWhatsapp != null
        ? { phone: row.userPhone, whatsapp: row.userWhatsapp }
        : null,
  }));
};

export const createAppointment = async (appointment: NewAppointment) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }

  const [{ id }] = await db
    .insert(appointments)
    .values({
      ...appointment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .$returningId();

  const appointmentData = await db.query.appointments.findFirst({
    where: eq(appointments.id, id),
  });

  return { ok: true, data: appointmentData ? [appointmentData] : [] };
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
