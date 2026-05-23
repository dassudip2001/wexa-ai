import { CheckCircle } from "lucide-react";
import { ModalProps } from "../invite/InviteUser";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function DeleteApiKeyModel({
  open,
  onOpenChange,
  token,
}: ModalProps) {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await api.delete(`/organizations/api-delete/${token}`);
      toast.success("API key deleted successfully!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      onOpenChange(false);
    },
  });
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={() => mutate()}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {isPending ? "Loading..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
