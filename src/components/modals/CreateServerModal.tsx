"use client";

import { useModal } from "@/hooks/use-modal-store";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import FileUpload from "../FileUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required!" }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

const CreateServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);

      toast.success("Server created successfully! 🎉");

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");

      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create your server
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endPoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-background focus-visible:ring-offset-0 focus-visible:ring-2"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-muted/50 px-6 py-4">
              <Button disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Server"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
