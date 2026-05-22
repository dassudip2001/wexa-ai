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

export default function DeleteApiKeyModel({ open, onOpenChange }: ModalProps) {
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
            <Button
              className="w-full"
              onClick={() => console.log("Delete API Key")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {/* {query.isPending ? "Loading..." : "Delete"} */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
