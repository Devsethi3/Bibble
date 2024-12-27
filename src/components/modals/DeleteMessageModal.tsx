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
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import qs from "query-string";

const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";

  const { apiUrl, query } = data || {};

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });

      await axios.delete(url);

      toast.success("Message deleted");

      onClose();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || "Failed to delete the message."
        : "An unexpected error occurred while deleting the message.";
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to delete the message."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Are you sure you want to delete? <br /> This message will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
              variant="destructive"
            >
              {isLoading ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete Message"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
