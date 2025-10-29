"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { useDispatch } from "react-redux";
import { resetAdmin } from "@/store/features/adminSlice";
import { logout } from "@/actions/adminAuth";

const AdminLogout = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();

      dispatch(resetAdmin());

      router.push(`/admin/logout`);
    });
  };
  return (
    <Button
      onClick={handleLogout}
      className="bg-emerald-900 cursor-pointer text-white hover:bg-emerald-700 font-bold"
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <LogOut />
          <span className="ml-2">Logout</span>
        </>
      )}
    </Button>
  );
};

export default AdminLogout;
