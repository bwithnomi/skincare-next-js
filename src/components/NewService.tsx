import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus, SquarePen, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { serviceSchema } from "@/lib/validators/service";
import { createNewService } from "@/actions/services";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Service } from "@/db/schema";
type FormData = {
  title: string;
  sub_categories: string[];
};

type NewServiceProps = {
  onNewService: (service: Service) => void;
};

const NewService = ({ onNewService }: NewServiceProps) => {
  const [creating, startCreating] = useTransition();
  const [formData, setForData] = useState<FormData>({
    title: "",
    sub_categories: [],
  });
  const [subCategory, setSubCategory] = useState<string>("");

  const addToSubcategories = () => {
    if (subCategory.trim() === "") return;
    setForData({
      ...formData,
      sub_categories: [...formData.sub_categories, subCategory.trim()],
    });
    setSubCategory("");
  };

  const removeFromSubcategories = (category: string) => {
    setForData({
      ...formData,
      sub_categories: formData.sub_categories.filter((cat) => cat !== category),
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = serviceSchema.safeParse(formData);

    if (!parsed.success) {
      let errorMessage = "";
      parsed.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". \b";
      });
      toast.error(errorMessage);
      return;
    }

    startCreating(async () => {
      const response = await createNewService(formData);

      if (!response.ok) {
        toast.error(response.errors);
        return;
      }
      if (response?.data?.length) {
        onNewService(response.data[0]);
        // reset form
        setForData({
          title: "",
          sub_categories: [],
        });
        toast("Service created successfully");
      }
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-900 hover:bg-emerald-800 cursor-pointer">
          <SquarePen />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create new service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue=""
                value={formData.title}
                onChange={(e) =>
                  setForData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Sub categories</Label>
              <div className="flex">
                <Input
                  id="username-1"
                  name="username"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                />
                <Button
                  className="ml-2 cursor-pointer"
                  type="button"
                  onClick={addToSubcategories}
                >
                  <Plus />
                </Button>
              </div>
              <div className="">
                {formData.sub_categories.map((category, index) => (
                  <Badge
                    variant="secondary"
                    key={`category-${index}`}
                    className="bg-emerald-600 text-white dark:bg-blue-600"
                    onClick={() => removeFromSubcategories(category)}
                  >
                    <X className="cursor-pointer" />
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={creating}>
              {creating ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewService;
