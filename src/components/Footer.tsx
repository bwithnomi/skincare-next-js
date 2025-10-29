import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { fetchFooter } from "../actions/footer.action";

const Footer = async () => {
  const footerData = await fetchFooter();
  return (
    <footer className="bg-green-50">
      <div className="md:px-8 px-4 py-12 flex md:flex-row flex-row flex-wrap gap-y-8 md:gap-y-0">
        <div className="md:basis-1/3 basis-1/2 md:mr-0 mr-8">
          <div className="nav-brand">
            <Image src="./next.svg" alt="logo" width={140} height={80} />
          </div>
          <p className="text-sm mt-2">Accessible. Affordable. Quality.</p>
          <p className="flex gap-2 text-sm mt-8 items-center">
            <MapPin color="green" />
            <span className="font-bold">{footerData?.address}</span>
          </p>
          <p className="flex gap-2 text-sm mt-4 items-center">
            <Phone color="green" />
            <span className="font-bold">{footerData?.phone}</span>
          </p>
          <p className="flex gap-2 text-sm mt-4 items-center">
            <Mail color="green" />
            <span className="font-bold">{footerData?.email}</span>
          </p>
        </div>
        <div className="md:basis-1/5 basis-1/3">
          <p className="font-bold text-lg mb-4">Pages</p>
          <Link href={"/"} className="">
            <p className="mb-2">Home</p>
          </Link>
          <Link href={"/about"}>
            <p className="mb-2">About</p>
          </Link>
          <Link href={"/services"} className="">
            <p className="mb-2">Services</p>
          </Link>
          <Link href={"/contact"} className="">
            <p className="mb-2">Contact</p>
          </Link>
          <Link href={"#"} className="">
            <p className="mb-2">Blogs</p>
          </Link>
        </div>
        <div className="md:basis-1/5 basis-1/2">
          <p className="font-bold text-lg mb-4">Reach Us</p>
          <div className="flex gap-4">
            <Link href={footerData?.facebook || "#"} className="">
              <Facebook className="mb-2"></Facebook>
            </Link>
            <Link href={footerData?.linkedin || "#"}>
              <Linkedin className="mb-2"></Linkedin>
            </Link>
            <Link href={footerData?.instagram || "#"}>
              <Instagram className="mb-2"></Instagram>
            </Link>
          </div>
        </div>
        <div className="md:basis-1/4 basis-1/2">
          <p className="font-bold text-lg">Certified Doctors</p>
          <Image
            src={"./certification.svg"}
            width={150}
            height={200}
            alt=""
            className="mt-4"
          ></Image>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
