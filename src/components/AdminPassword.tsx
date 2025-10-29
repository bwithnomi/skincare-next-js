"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { updatePasswordSchema } from "@/lib/validators/update-password";
import { adminUpdatePassword } from "@/actions/adminAuth";

const AdminPassword = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  });
  const [fetchingFooter, startFetching] = useTransition();
  const [updating, startUpdating] = useTransition();

  const saveFooter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = updatePasswordSchema.safeParse(passwordData);

    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    startUpdating(async () => {
      const res = await adminUpdatePassword(passwordData);

      if (!res.ok) {
        toast.error(res.errors);
        return;
      }

      toast("Password Updated");
    });
  };

  return (
    <div className="w-[500px]">
      <form onSubmit={saveFooter}>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update password here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="old_password">Old Password</Label>
                <Input
                  id="old_password"
                  type="password"
                  placeholder="*******"
                  required
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*******"
                  required
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="*******"
                  required
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-900 cursor-pointer hover:bg-emerald-800"
              disabled={updating}
            >
              {updating ? (
                <Spinner />
              ) : (
                <>
                  <Save />
                  Update
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AdminPassword;
