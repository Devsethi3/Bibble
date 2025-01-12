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
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const DeleteServerModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteServer";

  const server = data?.server;

  const onClick = async () => {
    if (!server) {
      toast.error("Server information is not available. Unable to proceed.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.delete(`/api/servers/${server.id}`);

      if (response.status === 200) {
        onClose();

        toast.success(
          `The server "${server.name}" has been successfully deleted.`
        );

        try {
          // Fetch remaining servers
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
          toast.error("Something went wrong!")

          // If fetching servers fails, redirect to get-started
          setTimeout(() => {
            router.push("/get-started");
            router.refresh();
          }, 100);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data || "Failed to delete the server.";
        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to delete the server."
        );
      } else {
        toast.error("An unexpected error occurred while deleting the server.");
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
            <LinkIcon className="w-6 h-6 text-destructive" />
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {server ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-destructive">
                  {server.name}
                </span>
                ? This action cannot be undone and all data will be permanently
                deleted.
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
              {isLoading ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete Server"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
