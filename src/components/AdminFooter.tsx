"use client";

import React, { useEffect, useState, useTransition } from "react";
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
import { fetchFooter, updateFooter } from "../actions/footer.action";
import { Footer } from "@/db/schema";
import { footerSchema } from "@/lib/validators/footer";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

const AdminFooter = () => {
  const [footerData, setFooterData] = useState<Footer | undefined>();
  const [fetchingFooter, startFetching] = useTransition();
  const [updating, startUpdating] = useTransition();

  const saveFooter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = footerSchema.safeParse(footerData);

    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    startUpdating(async () => {
      const res = await updateFooter(footerData!);

      if (!res.ok) {
        toast.error(res.errors);
        return;
      }

      toast("Footer Updated");
    });
  };

  useEffect(() => {
    startFetching(async () => {
      let data = await fetchFooter();
      setFooterData(data);
    });
  }, []);
  return (
    <div className="w-[500px]">
      <form onSubmit={saveFooter}>
        <Card>
          <CardHeader>
            <CardTitle>Footer</CardTitle>
            <CardDescription>Edit footer content here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, email: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.email || ""}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+1 *** *** ****"
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, phone: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.phone || ""}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="address"
                    type="text"
                    placeholder="Complete address here..."
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, address: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.address || ""}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facebook">Facebook</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="facebook"
                    type="text"
                    placeholder="Facebook link here"
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, facebook: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.facebook || ""}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="linkedin"
                    type="text"
                    placeholder="Linkedin link here"
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, linkedin: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.linkedin || ""}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram</Label>
                {fetchingFooter ? (
                  <Skeleton className="h-[36px] w-full rounded-sm" />
                ) : (
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="Instagram link here"
                    required
                    onChange={(e) =>
                      setFooterData(
                        footerData
                          ? { ...footerData, instagram: e.target.value }
                          : undefined
                      )
                    }
                    value={footerData?.instagram || ""}
                  />
                )}
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
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AdminFooter;
