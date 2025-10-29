"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Delete, Eye } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Blog = {
  id: number;
  title: string;
  author: string;
  createdAt: Date;
};

export const createColumns = (
  onDelete: (id: number) => void,
  deleting: boolean,
  deleteId: number
): ColumnDef<Blog>[] => [
  {
    accessorKey: "id",
    header: "Sr. no",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="truncate w-40">{row.getValue("title")}</p>;
    },
  },
  {
    accessorKey: "author",
    header: "author",
    cell: ({ row }) => {
      return <p className="truncate w-40">{row.getValue("author")}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Published at",
    cell: ({ row }) => {
      return (
        <p>
          {formatDistanceToNow(new Date(row.getValue("createdAt")), {
            addSuffix: true,
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${row.getValue("id")}`}>
            <Button className="cursor-pointer">
              <Eye />
            </Button>
          </Link>

          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => onDelete(row.getValue("id"))}
            disabled={deleting}
          >
            {deleting && deleteId == row.getValue("id") ? (
              <Spinner />
            ) : (
              <Delete />
            )}
          </Button>
        </div>
      );
    },
  },
];

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "id",
    header: "Sr. no",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="truncate w-40">{row.getValue("title")}</p>;
    },
  },
  {
    accessorKey: "author",
    header: "author",
    cell: ({ row }) => {
      return <p className="truncate w-40">{row.getValue("author")}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Published at",
    cell: ({ row }) => {
      return (
        <p>
          {formatDistanceToNow(new Date(row.getValue("createdAt")), {
            addSuffix: true,
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${row.getValue("id")}`}>
            <Button className="cursor-pointer">
              <Eye />
            </Button>
          </Link>

          <Button variant="destructive" className="cursor-pointer">
            <Delete />
          </Button>
        </div>
      );
    },
  },
];
