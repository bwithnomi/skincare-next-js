"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { Blog } from "@/db/schema";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { createNewBlog } from "@/actions/blogs";
import { blogSchema } from "@/lib/validators/blog";
import Editor from "./Editor";
import { useRouter } from "next/navigation";

const NewBlog = () => {
  const [blogData, setBlogData] = useState<
    Pick<Blog, "author" | "title" | "content">
  >({
    title: "",
    content: "",
    author: "",
  });
  const router = useRouter();

  const setContent = (val: string) => {
    setBlogData({...blogData, content:val});
  }
  const [updating, startUpdating] = useTransition();

  const saveBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = blogSchema.safeParse(blogData);

    if (!result.success) {
      console.log(blogData);

      toast.error(result.error.message);
      return;
    }

    startUpdating(async () => {
      const res = await createNewBlog(blogData);

      if (!res.ok) {
        toast.error(res.errors);
        return;
      }

      toast("Blog Published");
      router.push("/admin/blogs")
    });
  };

  return (
    <div className="w-[500px]">
      <form onSubmit={saveBlog}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Blog title here"
                  required
                  onChange={(e) =>
                    setBlogData({ ...blogData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Blog author name"
                  required
                  onChange={(e) =>
                    setBlogData({ ...blogData, author: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">content</Label>
                <Editor content={blogData.content} onChange={setContent}/>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-900 cursor-pointer hover:bg-emerald-800"
              disabled={updating}
            >
              {updating ? (
                <Spinner />
              ) : (
                <>
                  <Save />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewBlog;
