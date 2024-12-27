import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";

interface MessageWithMemberWithProfile extends Message {
  member: Member & {
    profile: Profile;
  };
}

interface ApiResponse {
  items: MessageWithMemberWithProfile[];
  nextCursor: string | null;
}

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {

  const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    return res.json() as Promise<ApiResponse>;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey, paramValue],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage: ApiResponse) => lastPage.nextCursor,
      initialPageParam: undefined,
      // refetchInterval: isConnected ? false : 1000,
      refetchInterval: 1000,
      enabled: Boolean(paramValue),
      staleTime: 60 * 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
