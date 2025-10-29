"use client";

import React, { useEffect, useState, useTransition } from "react";
import { DataTable } from "./data-table";
import { Blog, columns } from "./columns";
import { fetchBlogs } from "@/actions/blogs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePen, Table } from "lucide-react";
import BlogTable from "./table";
import { Skeleton } from "@/components/ui/skeleton";

const AdminBlogs = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [fetching, startFetching] = useTransition();

  const deleteBlog = (id: number) => {
    const newData = data.filter((d) => d.id != id);
    setData(newData);
  };

  useEffect(() => {
    startFetching(async () => {
      let blogs = await fetchBlogs();
      setData(blogs);
    });
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-4">
        <p className="font-bold">Blogs</p>
        <Link href={`/admin/blogs/new`}>
          <Button className="bg-emerald-900 hover:bg-emerald-800 cursor-pointer">
            <SquarePen />
            Create new
          </Button>
        </Link>
      </div>
      {fetching ? (
        <Skeleton className="w-full h-[600] rounded-sm" />
      ) : (
        <BlogTable blogs={data} onDelete={deleteBlog} />
      )}
    </div>
  );
};

export default AdminBlogs;
