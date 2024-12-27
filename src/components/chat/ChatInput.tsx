"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Loader2, Paperclip } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { GrSend } from "react-icons/gr";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty."),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl, query });
      await axios.post(url, values);
      form.reset();
      router.refresh();
      // toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send message");
      console.error("API Error:", error);
    }
  };

  return (
    <div className="sticky bottom-0 w-full border-t dark:border-zinc-700 bg-white dark:bg-[#2c2c2e] p-4 backdrop-blur-lg bg-opacity-90">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder={`Message ${
                          type === "conversation" ? name : "#" + name
                        }`}
                        className="pr-24 pl-12 min-h-[3rem] dark:border-zinc-600 bg-zinc-100/80 dark:bg-[#1c1c1e]/80 text-zinc-900 dark:text-zinc-100 focus:outline-none border-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all duration-200"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <button
                          onClick={() =>
                            onOpen("messageFile", { apiUrl, query })
                          }
                          type="button"
                          className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200"
                          title="Attach file"
                        >
                          <Paperclip className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        </button>
                      </div>
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <div className="text-muted-foreground mt-1">
                          <EmojiPicker
                            onChange={(emoji: string) =>
                              field.onChange(`${field.value} ${emoji}`)
                            }
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          size="icon"
                          // className="text-zinc-200"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin " />
                          ) : (
                            <GrSend className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
