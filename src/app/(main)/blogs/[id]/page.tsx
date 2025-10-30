import { fetchBlogById } from "@/actions/blogs";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "GulSkincare - Blogs",
  description:
    "Board-certified dermatology care for acne, aging, pigmentation, hair loss and more.",
};
const BlogViewUser = async ({ params }: { params: { id: number } }) => {
  const blog = await fetchBlogById(params.id);

  if (!blog) {
    return <div className="">blog not found</div>;
  }
  return (
    <div className="min-h-[800px] md:px-40 md:py-20 py-10 px-8">
      <div className="mb-2 flex justify-between items-start gap-4">
        <div className="">
          <p className="text-2xl font-bold">{blog.title}</p>
          <p className="text-sm">
            <strong>Author:</strong> {blog.author} |{" "}
            <span className="text-gray-500">
              <strong>Published at:</strong>{" "}
              {formatDistanceToNow(new Date(blog.createdAt), {
                addSuffix: true,
              })}
            </span>
          </p>
        </div>
        <Link href={`/blogs`}>
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

export default BlogViewUser;
