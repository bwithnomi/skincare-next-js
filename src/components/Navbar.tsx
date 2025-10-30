import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import NavAuth from "./NavAuth";
import NavLinks from "./NavLinks";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur">
      <nav className="flex justify-between items-center md:px-8 px-4 md:py-4 py-2 shadow-sm">
        <div className="nav-brand hidden md:block">
          {/* <Image src="./next.svg" alt="logo" width={140} height={80} /> */}
          <p className="font-bold text-xl">GulSkincare</p>
        </div>
        <div className="nav-brand md:hidden">
          {/* <Image src="./next.svg" alt="logo" width={80} height={80} /> */}
          <p className="font-bold text-lg">GulSkincare</p>
        </div>
        <ul className="lg:flex items-center gap-10 hidden">
          {navItems.map((item, index) => (
            <NavLinks
              key={`${item.label}-${index}`}
              label={item.label}
              href={item.href}
            />
          ))}
        </ul>
        <div className="hidden lg:flex gap-2">
          <NavAuth />
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className="nav-brand lg:hidden">
                  {/* <Image src="./next.svg" alt="logo" width={80} height={80} /> */}
                  <p className="font-bold text-lg">GulSkincare</p>
                </div>
              </SheetTitle>
            </SheetHeader>

            <ul className="flex flex-col gap-4 px-4">
              {navItems.map((item, index) => (
                <NavLinks
                  key={`${item.label}-${index}`}
                  label={item.label}
                  href={item.href}
                />
              ))}
            </ul>
            <SheetFooter>
              <NavAuth />
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
