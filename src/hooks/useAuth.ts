// hooks/useAuth.ts
"use client";

import { useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useAuth() {
  const user = useSelector((state: RootState) => state.customer);
  const authUser = user.email;

  return {
    user,
    authUser,
    isAuthenticated: !!authUser,
  };
}
