import { useSocket } from "@/providers/SocketProvider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

interface ChatSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

interface MessageWithMemberWithProfile extends Message {
  member: Member & {
    profile: Profile;
  };
}

interface PageData {
  items: MessageWithMemberWithProfile[];
}

interface QueryData {
  pages: PageData[];
  pageParams?: unknown[];
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Use refs to maintain latest values in event handlers without triggering rerenders
  const queryKeyRef = useRef(queryKey);
  queryKeyRef.current = queryKey;

  // Memoize update handler to prevent unnecessary recreations
  const handleUpdate = useCallback(
    (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<QueryData>([queryKeyRef.current], (oldData) => {
        if (!oldData?.pages?.length) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === message.id ? message : item
            ),
          })),
        };
      });
    },
    [queryClient]
  );

  // Memoize add handler to prevent unnecessary recreations
  const handleAdd = useCallback(
    (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<QueryData>([queryKeyRef.current], (oldData) => {
        // If no existing data, create new structure
        if (!oldData?.pages?.length) {
          return {
            pages: [{ items: [message] }],
            pageParams: [],
          };
        }

        // Create new pages array with new message at start of first page
        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!socket) return;

    // Add socket event listeners
    socket.on(updateKey, handleUpdate);
    socket.on(addKey, handleAdd);

    // Error handling
    const handleError = (error: Error) => {
      console.error("Socket error:", error);
      // Optionally trigger a reconnection or show user feedback
    };
    socket.on("error", handleError);

    // Connection status handling
    const handleDisconnect = (reason: string) => {
      if (reason === "io server disconnect") {
        // Server disconnected, attempt reconnect
        socket.connect();
      }
    };
    socket.on("disconnect", handleDisconnect);

    // Cleanup function
    return () => {
      socket.off(updateKey, handleUpdate);
      socket.off(addKey, handleAdd);
      socket.off("error", handleError);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, addKey, updateKey, handleAdd, handleUpdate]);

  // Optionally return connection status or utility methods
  return {
    isConnected: socket?.connected ?? false,
    // Add any additional utility methods here if needed
  };
};
