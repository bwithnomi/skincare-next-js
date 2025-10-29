"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createNewSchedule, fetchCurrentSchedule } from "@/actions/schedule";
import { DoctorSchedule, NewDoctorSchedule, WeeklySchedule } from "@/db/schema";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const AdminSchedule = () => {
  const [fetching, startFetching] = useTransition();
  const [updating, startUpdating] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<
    DoctorSchedule | NewDoctorSchedule
  >({
    weeklySchedule: {
      monday: { startTime: "", endTime: "", slotDuration: 0 },
      tuesday: { startTime: "", endTime: "", slotDuration: 0 },
      wednesday: { startTime: "", endTime: "", slotDuration: 0 },
      thursday: { startTime: "", endTime: "", slotDuration: 0 },
      friday: { startTime: "", endTime: "", slotDuration: 0 },
      saturday: { startTime: "", endTime: "", slotDuration: 0 },
      sunday: { startTime: "", endTime: "", slotDuration: 0 },
    },
  });
  const [viewableSchedule, setViewableSchedule] = useState<DoctorSchedule>();

  const setStartTime = (day: keyof WeeklySchedule, value: string) => {
    const sch = currentSchedule.weeklySchedule[day];

    if (sch?.endTime) {
      // Convert to minutes for comparison
      const startMinutes =
        parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
      const endMinutes =
        parseInt(sch.endTime.split(":")[0]) * 60 +
        parseInt(sch.endTime.split(":")[1]);
      // Validation
      if (startMinutes >= endMinutes) {
        toast.error("Start time must be earlier than end time!");
        return false; // ❌ don’t update if invalid
      }
    }
    setCurrentSchedule((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          startTime: value,
        },
      },
    }));
  };

  const setEndTime = (day: keyof WeeklySchedule, value: string) => {
    const sch = currentSchedule.weeklySchedule[day];

    if (sch?.startTime) {
      // Convert to minutes for comparison
      const endMinutes =
        parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
      const startMinutes =
        parseInt(sch.startTime.split(":")[0]) * 60 +
        parseInt(sch.startTime.split(":")[1]);
      // Validation
      if (startMinutes >= endMinutes) {
        toast.error("End time must be later than end time!");
        return false; // ❌ don’t update if invalid
      }
    }
    setCurrentSchedule((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          endTime: value,
        },
      },
    }));
  };

  const setDuration = (day: keyof WeeklySchedule, value: string) => {
    const sch = currentSchedule.weeklySchedule[day];

    if (parseInt(value) < 0 || parseInt(value) > 120) {
      toast.error("Invalid slot duration!");
      return false; // ❌ don’t update if invalid
    }
    setCurrentSchedule((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          slotDuration: parseInt(value),
        },
      },
    }));
  };

  const saveSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const day of currentSchedule.weeklySchedule
      ? Object.keys(currentSchedule.weeklySchedule)
      : []) {
      const i = currentSchedule.weeklySchedule[day as keyof WeeklySchedule];

      if (!i?.startTime || !i?.endTime || !i?.slotDuration) {
        setCurrentSchedule((prev) => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [day]: {
              startTime: "",
              endTime: "",
              slotDuration: 0,
            },
          },
        }));
        // toast.error(`Invalid ${day} schedule!`);
        // return false; // ❌ don’t update if invalid
      }
    }
    startUpdating(async () => {
      const updated = await createNewSchedule(currentSchedule);
      if (updated.ok && updated.data?.length) {
        setCurrentSchedule(updated.data[0]);
        setViewableSchedule(updated.data[0]);
        toast.info(`Schedule updated!`);
      } else {
        toast.error(updated.errors || "Failed to update schedule!");
      }
      setOpenModal(false);
    });
  };

  useEffect(() => {
    startFetching(async () => {
      let data = await fetchCurrentSchedule();
      if (data) {
        setCurrentSchedule(data);
        setViewableSchedule(data);
      }
    });
  }, []);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Edit doctor's schedule here</CardDescription>
          <CardAction>
            <Button
              className="bg-emerald-900 cursor-pointer hover:bg-emerald-700"
              onClick={() => setOpenModal(true)}
            >
              Edit Schedule
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {fetching ? (
            <Skeleton className="h-[36px] w-full rounded-sm" />
          ) : (
            <div>
              {Object.keys(currentSchedule?.weeklySchedule).map(
                (key, index) => {
                  const day = key as keyof WeeklySchedule;
                  return (
                    <div className="my-4" key={`${day}-schedule-${index}`}>
                      <div className="flex gap-4">
                        <p className="capitalize font-bold w-[200px]">{day}:</p>
                        {viewableSchedule?.weeklySchedule[day]?.slotDuration ? (
                          <p>
                            Starts at:
                            {viewableSchedule.weeklySchedule[day]?.startTime} |
                            Ends at:
                            {viewableSchedule.weeklySchedule[day]?.endTime} |
                            Slots Available:
                            {(parseInt(
                              viewableSchedule.weeklySchedule[
                                day
                              ]?.endTime.split(":")[0]
                            ) *
                              60 +
                              parseInt(
                                viewableSchedule.weeklySchedule[
                                  day
                                ]?.endTime.split(":")[1]
                              ) -
                              (parseInt(
                                viewableSchedule.weeklySchedule[
                                  day
                                ]?.startTime.split(":")[0]
                              ) *
                                60 +
                                parseInt(
                                  viewableSchedule.weeklySchedule[
                                    day
                                  ]?.startTime.split(":")[1]
                                ))) /
                              viewableSchedule.weeklySchedule[day]
                                ?.slotDuration}
                            ,{" "}
                            {viewableSchedule.weeklySchedule[day]?.slotDuration}{" "}
                            mins Each
                          </p>
                        ) : (
                          <p>No slots available or Day Off</p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
          <form onSubmit={saveSchedule}>
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              {Object.keys(currentSchedule?.weeklySchedule).map(
                (key, index) => {
                  const day = key as keyof WeeklySchedule;
                  return (
                    <div className="" key={`${day}-input-${index}`}>
                      <div className="grid">
                        <p className="font-bold text-sm capitalize">{day}</p>
                        <div className="flex gap-2">
                          <div className="">
                            <p className="text-xs">Start</p>
                            <Input
                              id={`start-${day}`}
                              name={`start-${day}`}
                              type="time"
                              value={
                                currentSchedule.weeklySchedule[day]?.startTime
                              }
                              onChange={(e) =>
                                setStartTime(day, e.target.value)
                              }
                            />
                          </div>
                          <div className="">
                            <p className="text-xs">End</p>
                            <Input
                              id={`end-${day}`}
                              name={`end-${day}`}
                              type="time"
                              value={
                                currentSchedule.weeklySchedule[day]?.endTime
                              }
                              onChange={(e) => setEndTime(day, e.target.value)}
                            />
                          </div>
                          <div className="">
                            <p className="text-xs">Duration</p>
                            <Input
                              id={`duration-${day}`}
                              name={`duration-${day}`}
                              type="number"
                              min={0}
                              max={120}
                              value={
                                currentSchedule.weeklySchedule[day]
                                  ?.slotDuration
                              }
                              onChange={(e) => setDuration(day, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={updating}
              >
                {updating ? <Spinner /> : <span>Save changes</span>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSchedule;
