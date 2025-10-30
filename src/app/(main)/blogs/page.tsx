import { fetchBlogs } from "@/actions/blogs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { EyeIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "GulSkincare - Blogs",
  description:
    "Board-certified dermatology care for acne, aging, pigmentation, hair loss and more.",
};
const UserBlogs = async () => {
  const blogs = await fetchBlogs();
  return (
    <>
      <section className="bg-gray-50">
        <div className="md:px-40 md:py-20 py-10 px-8 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">Blogs</p>
            <p className=" text-center md:text-left"></p>
          </div>
          <div className="flex flex-wrap gap-2">
            {blogs.map((blog, index) => (
              <Card key={`${blog.title}-${index}`} className="my-2 lg:basis-1/3 basis-full">
                <CardHeader>
                  <CardTitle className="truncate w-60">{blog.title}</CardTitle>
                  <CardDescription>Author: {blog.author}</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="w-full">
                  <div className="flex justify-between w-full">
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <Link href={`/blogs/${blog.id}`}>
                    <Button
                      type="submit"
                      className=" bg-emerald-900 cursor-pointer hover:bg-emerald-800"
                    >
                      <EyeIcon />
                      View
                    </Button></Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className=""></div>
    </>
  );
};

export default UserBlogs;
