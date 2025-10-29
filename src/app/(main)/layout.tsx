import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default AdminLayout;
