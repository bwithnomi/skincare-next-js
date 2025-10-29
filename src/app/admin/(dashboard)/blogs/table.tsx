"use client";

import React, { useState, useTransition } from "react";
import { Blog, createColumns } from "./columns";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBlogById } from "@/actions/blogs";
import { Spinner } from "@/components/ui/spinner";

type BlogListProps = {
  blogs: Blog[];
  onDelete: (id: number) => void
};
const BlogTable = ({ blogs, onDelete }: BlogListProps) => {
  const [deleteId, setDeleteId] = useState<number>(0);
  const [deleting, startDeleting] = useTransition();
  const [open, setOpen] = useState(false);
  const columns = createColumns(
    (id) => handleDeleteClick(id),
    deleting,
    deleteId
  );

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const deleteBlog = () => {
    startDeleting(async () => {
      await deleteBlogById(deleteId);
      onDelete(deleteId)
      setDeleteId(0);
      setOpen(false);
    });
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      console.log("Dialog closed — do cleanup here", isOpen, open);
    }
    setOpen(isOpen);
  };

  return (
    <>
      <DataTable columns={columns} data={blogs} />
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Do you want to delete this blog?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-end">
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteBlog()}
                disabled={deleting}
                className="cursor-pointer"
              >
                {deleting ? <Spinner /> : "Yes Delete"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogTable;
