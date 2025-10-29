"use client";

import React from "react";
import UserSignout from "./UserSignout";
import UserSignup from "./UserSignup";
import UserSignin from "./UserSignin";
import { useAuth } from "@/hooks/useAuth";

const NavAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <UserSignout />
  ) : (
    <>
      <UserSignin />
      <UserSignup />
    </>
  );
};

export default NavAuth;
