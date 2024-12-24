"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import FileUpload from "@/components/FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachmenet is required",
  }),
});

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      toast.success("Attachement sent successfully! 🎉");
      router.refresh();
      handleClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="overflow-hidden bg-background text-foreground shadow-lg rounded-lg max-w-md mx-auto sm:max-w-lg">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-extrabold text-primary">
              Add an attachment
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Send a file as a message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="bg-secondary px-6 py-4 rounded-b-lg">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-dark flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 mr-2 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageFileModal;
