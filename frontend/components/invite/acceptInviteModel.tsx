import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CheckCircle } from "lucide-react";
import { ModalProps } from "./InviteUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function AcceptInviteModel({ open, onOpenChange,token }: ModalProps) {
    const query = useQuery({
        queryKey: ["acceptInvite", token],
        queryFn: async () => {
            const response = await api.get(`/organizations/accept/${token}`,);
            return response.data;
        },
        enabled: !!token && open,
    });
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Accept Invite</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to accept this invite?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button className="w-full" onClick={() => query.refetch()}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {query.isPending ? "Loading..." : "Accept"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}