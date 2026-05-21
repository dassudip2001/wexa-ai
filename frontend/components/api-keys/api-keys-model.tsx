"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ModalProps } from "../invite/InviteUser";

export type ApiKeyInput = {
  name: string;
};

export default function ApiKeyModel({ open, onOpenChange }: ModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiKeyInput>();
  const onSubmit: SubmitHandler<ApiKeyInput> = async (data) => {
    mutation.mutate(data);
  };
  const mutation = useMutation({
    mutationFn: async (data: ApiKeyInput) => {
      const response = await api.post("/organizations/api-create/", data);
      return response.data;
    },
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for your organization.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field className="space-y-2">
                <Label htmlFor="name-1">Name</Label>

                <Input
                  id="name-1"
                  type="text"
                  placeholder="Enter name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </Field>

              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
