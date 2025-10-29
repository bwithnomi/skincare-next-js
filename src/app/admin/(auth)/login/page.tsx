"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSignInAction } from "../../../../actions/adminAuth";
import { signInSchema } from "@/lib/validators/auth";
import { toast } from "sonner";
import { useTransition } from "react";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/store/features/adminSlice";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const [isSending, startSending] = useTransition();
  const router = useRouter()


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
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
    startSending(async () => {
      try {
        const result = await adminSignInAction(fd as any); // FormData is allowed
        if (result?.ok) {
          // navigate to homepage or dashboard
          dispatch(
            setAdmin({
              email: result?.user?.email || null,
            })
          );
          router.push("/admin")
        } else {
          toast.error("Login failed");
        }
      } catch (err: any) {
        // show nice message
        toast.error(err?.message || "Login error");
      }
    });
  };

  return (
    <main className="grid place-items-center min-h-screen bg-emerald-900">
      <form onSubmit={login} className="w-full max-w-sm">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login as Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer">
              {isSending ? <Spinner/> : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
