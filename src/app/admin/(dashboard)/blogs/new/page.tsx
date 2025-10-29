import NewBlog from "@/components/NewBlog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const CreateNew = () => {
  return (
    <div className="pt-4">
      <div className="mb-2">
        <Link href={`/admin/blogs`}>
          <Button className="bg-emerald-900 hover:bg-emerald-900 cursor-pointer">
            <ArrowLeft />
            Back
          </Button>
        </Link>
      </div>
      <NewBlog />
    </div>
  );
};

export default CreateNew;
