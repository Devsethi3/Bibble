"use client";

import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const LeaveServerModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "leaveServer";

  const server = data?.server;

  const onClick = async () => {
    if (!server) {
      toast.error("No server information available.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.patch(`/api/servers/${server.id}/leave`);

      if (response.status === 200) {
        // First close the modal
        onClose();

        // Show success message
        toast.success("You have successfully left the server.");

        try {
          // Fetch available servers
          const { data: servers } = await axios.get("/api/servers");

          // Use setTimeout to ensure state updates have propagated
          setTimeout(() => {
            if (servers && servers.length > 0) {
              router.push(`/servers/${servers[0].id}`);
            } else {
              router.push("/get-started");
            }
            router.refresh();
          }, 100);
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong!");

          router.push("/get-started");
          router.refresh();
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data || "Failed to leave the server.";
        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to leave the server."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <LinkIcon className="w-6 h-6 text-primary" />
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {server ? (
              <>
                Are you sure you want to leave{" "}
                <span className="text-primary underline">{server.name}</span>?
              </>
            ) : (
              "Server information is unavailable."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading || !server}
              onClick={onClick}
              variant="destructive"
            >
              {isLoading ? "Leaving..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
