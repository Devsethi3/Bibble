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
import {  useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import qs from "query-string";

const DeleteChannelModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";

  const { server, channel } = data || {};

  const onClick = async () => {
    if (!server || !channel) {
      toast.error("Channel or server information is unavailable.");
      return;
    }

    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.delete(url);

      if (response.status === 200) {
        onClose();
        toast.success(
          `The channel "#${channel.name}" has been successfully deleted.`
        );
      }

      router.refresh();
      router.push(`/servers/${server.id}`);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || "Failed to delete the channel."
        : "An unexpected error occurred while deleting the channel.";
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to delete the channel."
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
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {channel ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-destructive">
                  #{channel.name}
                </span>
                ? This action cannot be undone and all data will be permanently
                deleted.
              </>
            ) : (
              "Channel information is unavailable."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isLoading || !server || !channel}
              onClick={onClick}
              variant="destructive"
            >
              {isLoading ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete Channel"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
