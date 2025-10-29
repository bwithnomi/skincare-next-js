"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { fetchCurrentSchedule } from "@/actions/schedule";
import { DoctorSchedule } from "@/db/schema";
import { useAuth } from "@/hooks/useAuth";
import {
  createAppointment,
  fetchPendingAppointmentByDate,
} from "@/actions/appointment";
import { Spinner } from "./ui/spinner";

// Define the form data type
interface FormData {
  // Step 1
  patient: string;
  issue: string;
  consultation_type: string;
  // Step 2
  checkup_date: Date;
  checkup_slot: string;
  // Step 3
}

// Define validation errors type
interface ValidationErrors {
  [key: string]: string;
}

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const TOTAL_STEPS = 3;

const BookNow = () => {
  const customer = useSelector((state: RootState) => state.customer);
  const [schedule, setSchedule] = useState<DoctorSchedule>();
  const [slots, setSlots] = useState<string[]>([]);
  const dateNow = new Date();
  const [openModal, setOpenModal] = useState(false);
  const [loading, startLoading] = useTransition();
  const [submiting, startSubmit] = useTransition();
  const [fetchingAppointment, startFetching] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const user = useAuth();
  const [formData, setFormData] = useState<FormData>({
    patient: "",
    issue: "",
    consultation_type: "",
    checkup_date: new Date(dateNow.setDate(dateNow.getDate() + 1)),
    checkup_slot: "",
  });

  // Update form data
  const updateFormData = (
    field: keyof FormData,
    value: string | boolean | Date
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (!formData.patient.trim()) {
        newErrors.patient = "patient is required";
      }
      if (!formData.issue.trim()) {
        newErrors.issue = "issue is required";
      }
      if (!formData.consultation_type.trim()) {
        newErrors.consultation_type = "consultation type is required";
      }
    }

    if (step === 2) {
      if (!formData.checkup_slot.trim()) {
        newErrors.checkup_slot = "Checkup slot is required";
      }
      if (!formData.checkup_date) {
        newErrors.checkup_date = "Checkup date is required";
      }
    }

    if (step === 3) {
      // if (!formData.message.trim()) {
      //   newErrors.message = 'Message is required';
      // } else if (formData.message.trim().length < 10) {
      //   newErrors.message = 'Message must be at least 10 characters';
      // }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user?.user) {
      return;
    }
    if (validateStep(currentStep)) {
      startSubmit(async () => {
        console.log("Form submitted:", formData);
        let res = await createAppointment({
          email: user.user.email!,
          checkup_date: formData.checkup_date.toDateString(),
          checkup_slot: formData.checkup_slot,
          consultation_type: formData.consultation_type,
          issue: formData.issue,
          patient: formData.patient,
        });

        console.log(res);

        setOpenModal(false);
        resetForm();
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep(1);
    setErrors({});
    setFormData({
      patient: "",
      issue: "",
      consultation_type: "",
      checkup_date: new Date(dateNow.setDate(dateNow.getDate() + 1)),
      checkup_slot: "",
    });
  };

  // Close dialog and reset
  const handleOpenChange = (newOpen: boolean) => {
    setOpenModal(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };
  function generateTimeSlots(
    startTime: string,
    endTime: string,
    slotDuration: number
  ): string[] {
    const slots: string[] = [];

    // Convert "HH:MM" → total minutes
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Convert minutes → "HH:MM"
    const toTime = (totalMinutes: number) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    let current = toMinutes(startTime);
    const end = toMinutes(endTime);

    // Generate slots until we reach the end
    while (current + slotDuration <= end) {
      const next = current + slotDuration;
      slots.push(`${toTime(current)} - ${toTime(next)}`);
      current = next;
    }

    return slots;
  }

  useEffect(() => {
    if (formData.checkup_date && schedule) {
      const day = formData.checkup_date.getDay();
      const dayKey = days[day];
      const startTime =
        schedule.weeklySchedule[dayKey as keyof typeof schedule.weeklySchedule]
          ?.startTime;
      const endTime =
        schedule.weeklySchedule[dayKey as keyof typeof schedule.weeklySchedule]
          ?.endTime;
      const duaration =
        schedule.weeklySchedule[dayKey as keyof typeof schedule.weeklySchedule]
          ?.slotDuration;
      if (startTime && endTime && duaration) {
        startFetching(async () => {
          const appointments = await fetchPendingAppointmentByDate(
            formData.checkup_date.toDateString()
          );
          const bookedSlots = appointments.map((app) => app.checkup_slot);
          const allSlots = generateTimeSlots(startTime, endTime, duaration);
          const availableSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
          );
          setSlots(availableSlots);
        });
      } else {
        setSlots([]);
      }
    }
  }, [formData.checkup_date, schedule]);

  useEffect(() => {
    startLoading(async () => {
      const data = await fetchCurrentSchedule();
      if (data) {
        setSchedule(data);
        const day = formData.checkup_date.getDay();
        const dayKey = days[day];
        const startTime =
          data.weeklySchedule[dayKey as keyof typeof data.weeklySchedule]
            ?.startTime;
        const endTime =
          data.weeklySchedule[dayKey as keyof typeof data.weeklySchedule]
            ?.endTime;
        const duaration =
          data.weeklySchedule[dayKey as keyof typeof data.weeklySchedule]
            ?.slotDuration;
        if (startTime && endTime && duaration) {
          const slots = generateTimeSlots(startTime, endTime, duaration);
          setSlots(slots);
        }
      }
    });
  }, []);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p>Who is the booking for?</p>
              {errors.patient && (
                <p className="text-sm text-red-500">{errors.patient}</p>
              )}

              <Select
                value={formData.patient}
                onValueChange={(e) => updateFormData("patient", e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="myself">For Myself</SelectItem>
                  <SelectItem value="someone">For Someone Else</SelectItem>
                  <SelectItem value="minor">For Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p>What issue can skindoc help you solve?</p>
              {errors.issue && (
                <p className="text-sm text-red-500">{errors.issue}</p>
              )}
              <Select
                value={formData.issue}
                onValueChange={(e) => updateFormData("issue", e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Issue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acne">Acne & Spot</SelectItem>
                  <SelectItem value="dark">Skin Rashes</SelectItem>
                  <SelectItem value="rash">Skin Changes</SelectItem>
                  <SelectItem value="moles">Moles & Growths</SelectItem>
                  <SelectItem value="no_rash">No Rash to see</SelectItem>
                  <SelectItem value="hair">Hair</SelectItem>
                  <SelectItem value="nails">Nails</SelectItem>
                  <SelectItem value="mouth">Mouth & Lips</SelectItem>
                  <SelectItem value="idk">I don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p>How you want the consultation?</p>
              {errors.consultation_type && (
                <p className="text-sm text-red-500">
                  {errors.consultation_type}
                </p>
              )}
              <Select
                value={formData.consultation_type}
                onValueChange={(e) => updateFormData("consultation_type", e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="consultation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Consultation</SelectItem>
                  <SelectItem value="photo">Photo Upload Service</SelectItem>
                  <SelectItem value="clinic">In Clinic Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p>Select a date and time</p>
              {errors.checkup_date && (
                <p className="text-sm text-red-500">{errors.checkup_date}</p>
              )}
              <Calendar
                disabled={{
                  before: new Date(dateNow.setDate(dateNow.getDate())),
                }}
                mode="single"
                selected={formData.checkup_date}
                onSelect={(date) => {
                  updateFormData("checkup_date", date!);
                  updateFormData("checkup_slot", "");
                }}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />

              <p>Available Slots</p>
              {errors.checkup_slot && (
                <p className="text-sm text-red-500">{errors.checkup_slot}</p>
              )}
              {fetchingAppointment ? (
                <Spinner />
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-scroll">
                  {slots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={
                        formData.checkup_slot === slot ? "default" : "outline"
                      }
                      className="text-sm cursor-pointer"
                      type="button"
                      onClick={() => updateFormData("checkup_slot", slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No slots available</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p>Appointment details</p>
              <ul className="list-disc list-inside text-sm">
                <li>
                  Email: <span className="font-medium">{user.user.email}</span>
                </li>
                <li>
                  Patient:{" "}
                  <span className="font-medium capitalize">
                    {formData.patient}
                  </span>
                </li>
                <li>
                  Issue:{" "}
                  <span className="font-medium capitalize">
                    {formData.issue}
                  </span>
                </li>
                <li>
                  Consultation Type:{" "}
                  <span className="font-medium capitalize">
                    {formData.consultation_type}
                  </span>
                </li>
                <li>
                  Date:{" "}
                  <span className="font-medium">
                    {formData.checkup_date.toDateString()}
                  </span>
                </li>
                <li>
                  Slot:{" "}
                  <span className="font-medium">{formData.checkup_slot}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold">Payment</p>
              <ol className="text-sm">
                <li>1. Send your payment on the Account below.</li>
                <li>Account Details:</li>
                <ul className="list-disc list-inside">
                  <li>Account Name: DermaDoc</li>
                  <li>Account Number: 1234567890</li>
                  <li>Bank: ABC Bank</li>
                  <li>Routing Number: 987654321</li>
                </ul>
                <li>
                  2. Send payment screenshot at this whatsapp number: +1 234 567
                  3456
                </li>
                <li>
                  3. if payment is not received inside 30 mins appointment will
                  be cancelled.
                </li>
              </ol>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <>
      <Dialog open={openModal} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-900 cursor-pointer hover:bg-transparent border-2 border-emerald-900 hover:text-emerald-900 text-white font-bold">
            <span>Book Now</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                <p className="mb-2">Start Booking</p>
                <p className="text-gray-500">
                  {currentStep === 1 && "Patient Information"}
                  {currentStep === 2 && "Scheduling"}
                  {currentStep === 3 && "Payment"}
                </p>
              </DialogTitle>
              <DialogDescription>
                Step {currentStep} of {TOTAL_STEPS}
              </DialogDescription>
            </DialogHeader>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-emerald-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <div className="py-4">{renderStepContent()}</div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="cursor-pointer"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <div className="flex gap-2">
                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="cursor-pointer"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {submiting ? <Spinner /> : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookNow;
