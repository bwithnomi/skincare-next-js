"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavLinkItem = {
  label: string;
  href: string;
};
const NavLinks = ({ label, href }: NavLinkItem) => {
  const pathname = usePathname();
  return (
    <li
      className={clsx(
        "font-sora text-emerald-800 hover:underline cursor-pointer underline-offset-2 font-bold duration-1000",
        `link ${pathname === href ? "bg-emerald-100 rounded-md px-4 py-1" : ""}`
      )}
    >
      <Link href={href}>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavLinks;
