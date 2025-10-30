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
import { LogIn } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/lib/validators/auth";
import { Spinner } from "./ui/spinner";
import { useDispatch } from "react-redux";
import { setCustomer } from "@/store/features/customerSlice";
import { signInAction } from "@/actions/userSignIn";

type SignInProps = {
  button_text?: string;
  icon?: boolean;
};

const UserSignin = ({ button_text = "Login", icon = true }: SignInProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // build object from FormData to validate with zod
    const raw = {
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    };

    // Validate using zod (throws on bad input)
    const parsed = signInSchema.safeParse(raw);

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
        const result = await signInAction(fd as any); // FormData is allowed
        if (result?.ok) {
          // navigate to homepage or dashboard
          dispatch(
            setCustomer({
              name: result?.user?.name || null,
              email: result?.user?.email || null,
              whatsapp: result?.user?.whatsapp || null,
              phone: result?.user?.phone || null,
            })
          );
          setOpen(false);
        } else {
          toast.error(result.errors || "Login failed");
        }
      } catch (err: any) {
        // show nice message
        toast.error(err?.message || "Login error");
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className=" cursor-pointer hover:text-white hover:bg-emerald-900 text-emerald-900 font-bold border-emerald-900 border-2"
        >
          {icon && <LogIn />}
          <span className="ml-2">{button_text}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Login Here</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" name="email" type="email" required />
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
          </div>
          <DialogFooter>
            <div>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer md:w-auto w-full"
              >
                {isPending ? <Spinner role="spinbutton" /> : "Login"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSignin;
