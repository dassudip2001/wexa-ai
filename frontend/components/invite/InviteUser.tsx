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
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
}

type Inputs = {
  email: string;
};

export default function InviteUserMOdel({ open, onOpenChange }: ModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const response = await api.post("/organizations/invite/", data);
      return response.data;
    },
    onSuccess: () => {
      onOpenChange(false);
    },
  });
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>
                Invite a new user to your organization.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label htmlFor="email-1">Email</Label>

                <Input
                  id="email-1"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </Field>

              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending..." : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
