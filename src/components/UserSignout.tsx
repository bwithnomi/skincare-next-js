"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/userSignup";
import { Spinner } from "./ui/spinner";
import { useDispatch } from "react-redux";
import { resetCustomer } from "@/store/features/customerSlice";

const UserSignout = () => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();

      dispatch(resetCustomer());
    });
  };
  return (
    <Button
      onClick={handleLogout}
      variant={"outline"}
      className=" cursor-pointer hover:text-white hover:bg-emerald-900 text-emerald-900 font-bold border-emerald-900 border-2"
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

export default UserSignout;
