"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signUpAction } from "@/actions/userSignup";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/validators/auth";
import { Spinner } from "./ui/spinner";
import { useDispatch } from "react-redux";
import { setCustomer } from "@/store/features/customerSlice";

const UserSignup = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // build object from FormData to validate with zod
    const raw = {
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      name: String(fd.get("name") ?? ""),
      confirmPassword: String(fd.get("confirmPassword") ?? ""),
    };

    // Validate using zod (throws on bad input)
    const parsed = signUpSchema.safeParse(raw);

    if (!parsed.success) {
      let errorMessage = "";
      parsed.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". \b";
      });
      toast.error(errorMessage);
      return;
    }

    // Call server action (it runs on server)
    startTransition(async () => {
      try {
        const result = await signUpAction(fd as any); // FormData is allowed
        if (result?.ok) {
          // navigate to homepage or dashboard
          dispatch(
            setCustomer({
              name: parsed.data.name,
              email: parsed.data.email,
              whatsapp: parsed.data.whatsapp,
              phone: parsed.data.phone,
            })
          );
          setOpen(false);
        } else {
          toast.error("Signup failed");
        }
      } catch (err: any) {
        // show nice message
        toast.error(err?.message || "Signup error");
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-emerald-900 cursor-pointer text-white font-bold hover:bg-emerald-200 hover:text-emerald-900"
        >
          <Lock />
          <span className="ml-2">Signup</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Sign Up Here</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input id="name" name="name" type="text" required />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2">
                Phone
              </Label>
              <Input id="phone" name="phone" type="text" required />
            </div>
            <div>
              <Label htmlFor="whatsapp" className="mb-2">
                Whatsapp
              </Label>
              <Input id="whatsapp" name="whatsapp" type="text" />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
          </div>
          <DialogFooter>
            <div>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer md:w-auto w-full"
              >
                {isPending ? <Spinner role="spinbutton" /> : "Create account"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSignup;
