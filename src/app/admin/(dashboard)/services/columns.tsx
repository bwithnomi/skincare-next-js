"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Service } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Delete, Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Blog = {
  id: number;
  title: string;
  author: string;
  createdAt: Date;
};

export const createServiceColumns = (
  onDelete: (id: number) => void,
  onView: (id: number) => void,
  deleting: boolean,
  deleteId: number
): ColumnDef<Service>[] => [
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
    accessorKey: "sub_categories",
    header: "categories",
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          className="cursor-pointer"
          onClick={() => onView(row.getValue("id"))}
        >
          <Eye />
        </Button>
      );
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

export const columns: ColumnDef<Service>[] = [
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
    accessorKey: "sub_categories",
    header: "categories",
    cell: ({ row }) => {
      return (
        <Button variant={"ghost"} className="cursor-pointer">
          <Eye />
        </Button>
      );
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
          <Button variant="destructive" className="cursor-pointer">
            <Delete />
          </Button>
        </div>
      );
    },
  },
];
