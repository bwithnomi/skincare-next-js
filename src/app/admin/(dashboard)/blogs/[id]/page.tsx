import { fetchBlogById } from "@/actions/blogs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const ViewBlog = async ({ params }: { params: { id: number } }) => {
  const blog = await fetchBlogById(params.id);

  if (!blog) {
    return <div className="">blog not found</div>;
  }

  return (
    <div className="pt-4">
      <div className="mb-2 flex justify-between items-start gap-4">
        <div className="">
          <p className="text-2xl font-bold">{blog.title}</p>
          <p className="text-sm">
            Author: {blog.author} |{" "}
            <span className="text-gray-500">
              Published at: {String(blog.createdAt)}
            </span>
          </p>
        </div>
        <Link href={`/admin/blogs`}>
          <Button className="bg-emerald-900 hover:bg-emerald-900 cursor-pointer">
            <ArrowLeft />
            Back
          </Button>
        </Link>
      </div>

      <div
        className="prose prose-lg max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: blog?.content }}
      />
    </div>
  );
};

export default ViewBlog;
