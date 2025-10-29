"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState, useTransition } from "react";
import { DataTable } from "./data-table";
import { createServiceColumns } from "./columns";
import { Service } from "@/db/schema";
import { deleteServiceById, fetchServices } from "@/actions/services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewService from "@/components/NewService";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const AdminSerives = () => {
  const [fetching, startFetching] = useTransition();
  const [open, setOpen] = useState(false);
  const [openView, setViewOpen] = useState(false);
  const [data, setData] = useState<Service[]>([]);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [viewId, setViewId] = useState<number>(0);
  const [deleting, startDeleting] = useTransition();
  const columns = createServiceColumns(
    (id) => handleDeleteClick(id),
    (id) => handleViewClick(id),
    deleting,
    deleteId
  );

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleViewClick = (id: number) => {
    setViewId(id);
    setViewOpen(true);
  };

  const addNewData = (service: Service) => {
    setData((prev) => [service, ...prev]);
  };

  const deleteService = () => {
    startDeleting(async () => {
      await deleteServiceById(deleteId);
      setDeleteId(0);
      const newData = data.filter((d) => d.id != deleteId);
      setData(newData);
      setOpen(false);
    });
  };

  useEffect(() => {
    startFetching(async () => {
      const res = await fetchServices();
      setData(res);
    });
  }, []);

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      console.log("Dialog closed — do cleanup here", isOpen, open);
    }
    setOpen(isOpen);
    setViewOpen(isOpen);
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-4">
        <p className="font-bold">Services</p>
        <NewService onNewService={(data) => addNewData(data)} />
      </div>
      {fetching ? (
        <Skeleton className="w-full h-[600] rounded-sm" />
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Do you want to delete this service?</DialogTitle>
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
                onClick={() => deleteService()}
                disabled={deleting}
                className="cursor-pointer"
              >
                {deleting ? <Spinner /> : "Yes Delete"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openView} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sub Categories</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {data
              .find((service) => service.id === viewId)
              ?.sub_categories.map((category, index) => (
                <Badge key={`category-${index}`} className="mb-2">
                  {category}
                </Badge>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSerives;
