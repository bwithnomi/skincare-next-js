"use client";

import {
  changeAppointmentStatusById,
  confirmAppointmentPaymentStatus,
  fetchAppointmentByDate,
} from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Appointment, AppointmentStatus } from "@/db/schema";
import clsx from "clsx";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [fetching, startFetching] = useTransition();
  const [updating, startUpdating] = useTransition();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const confirmPayment = async (id: number) => {
    // For demonstration, using a fixed appointment ID
    const appointmentId = id;
    if (!appointmentId) return;

    startUpdating(async () => {
      const result = await confirmAppointmentPaymentStatus(appointmentId);
      if (result.ok) {
        // Refresh appointments
        const data = await fetchAppointmentByDate(date.toDateString());
        setAppointments(data);
        toast("Status updated successfully.");
      } else {
        toast.error("Failed to confirm payment.");
      }
    });
  };

  const changeAppointmentStatus = async (
    id: number,
    status: AppointmentStatus
  ) => {
    // For demonstration, using a fixed appointment ID
    const appointmentId = id;
    if (!appointmentId) return;
    startUpdating(async () => {
      const result = await changeAppointmentStatusById(appointmentId, status);
      if (result.ok) {
        // Refresh appointments
        const data = await fetchAppointmentByDate(date.toDateString());
        setAppointments(data);
        toast("Status updated successfully.");
      } else {
        toast.error("Failed to confirm payment.");
      }
    });
  };

  useEffect(() => {
    // You can perform any side effects here when the date changes
    console.log("Selected date:", date);
    startFetching(async () => {
      // Simulate fetching appointments for the selected date
      // Replace this with actual data fetching logic
      if (date) {
        const data = await fetchAppointmentByDate(date.toDateString());
        setAppointments(data);
      }
    });
  }, [date]);
  return (
    <div className="px-8 pt-4">
      <p className="font-bold text-lg mb-4">Appointments</p>
      <div className="flex gap-4 justify-between">
        <div className="">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            required
            className="rounded-lg border"
          />
        </div>
        <div className="basis-2/3">
          <p className="font-semibold mb-2">
            Appointments for {date.toDateString()}
          </p>
          {fetching ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments for this date.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div className="flex w-full justify-between border p-4 rounded-lg shadow-sm">
                  <div key={appointment.id} className="">
                    <p>
                      <span className="font-semibold">Patient:</span>{" "}
                      {appointment.patient}
                    </p>
                    <p>
                      <span className="font-semibold">Issue:</span>{" "}
                      {appointment.issue}
                    </p>
                    <p>
                      <span className="font-semibold">Checkup Slot:</span>{" "}
                      {appointment.checkup_slot}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Status:</span>{" "}
                      {appointment.payment_status}
                    </p>
                    <p>
                      <span className="font-semibold">Appointment Status:</span>{" "}
                      <span className={clsx("capitalize font-bold", appointment.appointment_status === 'pending' && "text-yellow-400", appointment.appointment_status === 'cancelled' && "text-red-600", appointment.appointment_status === 'confirmed' && "text-blue-600", appointment.appointment_status === 'completed' && "text-green-600")}>{appointment.appointment_status}</span>
                    </p>
                  </div>
                  {(appointment.appointment_status == "pending" ||
                    appointment.appointment_status == "confirmed") && (
                    <div className="flex flex-col gap-2">
                      {appointment.payment_status === "pending" && (
                        <Button
                          className="cursor-pointer"
                          onClick={() => confirmPayment(appointment.id)}
                          disabled={updating}
                        >
                          Confirm Payment
                        </Button>
                      )}

                      <Button
                        variant={"destructive"}
                        className="cursor-pointer"
                        disabled={updating}
                        onClick={() =>
                          changeAppointmentStatus(
                            appointment.id,
                            AppointmentStatus.CANCELLED
                          )
                        }
                      >
                        Cancel Appointment
                      </Button>
                      {appointment.appointment_status === "confirmed" && (
                        <>
                          <Button
                            variant={"secondary"}
                            className="cursor-pointer"
                            disabled={updating}
                            onClick={() =>
                              changeAppointmentStatus(
                                appointment.id,
                                AppointmentStatus.RESHEDULED
                              )
                            }
                          >
                            Reschedule Appointment
                          </Button>

                          <Button
                            className="cursor-pointer bg-emerald-900"
                            disabled={updating}
                            onClick={() =>
                              changeAppointmentStatus(
                                appointment.id,
                                AppointmentStatus.COMPLETED
                              )
                            }
                          >
                            Complete Appointment
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
