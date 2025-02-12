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
import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required!" }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/servers", values);

      const { id } = response.data;

      toast.success("Server created successfully! 🎉");
      form.reset();
      router.push(`/servers/${id}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <Dialog open>
        <DialogContent className="overflow-hidden bg-background text-foreground shadow-lg rounded-lg max-w-md mx-auto sm:max-w-lg">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-extrabold text-primary">
              Create your server
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Give your server a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 px-6">
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
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter Server Name"
                          className="bg-secondary text-foreground focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-secondary px-6 py-4 rounded-b-lg">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-dark flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 mr-2 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
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

export default InitialModal;
