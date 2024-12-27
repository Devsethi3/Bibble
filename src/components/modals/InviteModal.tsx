"use client";

import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Check, Copy, RefreshCcw, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { useOrigin } from "@/hooks/use-origin";
import axios, { AxiosError } from "axios";

const InviteModal = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();

  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log(error);

      toast.error("Failed to copy link. Please try manually selecting it.");
    }
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
      toast.success("New invite link generated!");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data || "Failed to generate new invite link"
        );
      } else {
        toast.error("Something went wrong!");
      }
      console.error("Invite generation error:", error);
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
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Share this link with others to grant access to your server
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Server Invite Link
            </Label>
            <div className="flex items-center gap-x-2">
              <Input
                disabled={isLoading}
                className="bg-zinc-100/50 dark:bg-zinc-900/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-black dark:text-white focus-visible:ring-offset-0 selection:bg-primary/20"
                value={inviteUrl}
                readOnly
              />
              <Button
                disabled={isLoading}
                onClick={onCopy}
                variant="outline"
                size="icon"
                className="transition-all duration-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Generate a new link to invalidate the old one
            </span>
            <Button
              disabled={isLoading}
              onClick={onNew}
              variant="secondary"
              size="sm"
              className="text-sm text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 gap-2"
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  New Link
                  <RefreshCcw className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
