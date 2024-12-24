"use client";

import { useEffect, useRef, Fragment } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { useIntersection } from "@mantine/hooks";

import ChatWelcome from "./ChatWelcome";
import ChatItem from "./ChatItem";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, entry } = useIntersection({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  const { isConnected } = useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isFetchingNextPage) {
      scrollToBottom();
    }
  }, [data?.pages, isFetchingNextPage]);

  // Fetch older messages when "Load Previous Messages" is clicked
  const handleLoadPreviousMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (status === "pending") {
    return (
      <div className="flex flex-col h-[80vh] justify-center items-center">
        <Loader2 className="h-7 w-7 text-muted-foreground animate-spin my-2" />
        <p className="text-xs text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col h-[80vh] justify-center items-center">
        <ServerCrash className="h-7 w-7 text-rose-500 my-2" />
        <p className="text-sm text-muted-foreground">Something went wrong!</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-zinc-500 hover:text-zinc-600 mt-4 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex flex-col flex-1 h-[80vh] overflow-y-auto"
    >
      {/* Welcome message */}
      {!hasNextPage && (
        <div className="pt-4">
          <ChatWelcome type={type} name={name} />
        </div>
      )}

      {/* Load previous messages */}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin my-4" />
          ) : (
            <button
              onClick={handleLoadPreviousMessages}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      {/* Messages list */}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map(
              (
                message: Message & { member: Member & { profile: Profile } }
              ) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  currentMember={member}
                  member={message.member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              )
            )}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
