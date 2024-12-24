import { useEffect, useState, useCallback } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  loadMore,
  shouldLoadMore,
  count,
}: ChatScrollProps) => {
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    const chatContainer = chatRef?.current;
    if (!chatContainer) return;

    const scrollTop = chatContainer.scrollTop;

    // Detect user scrolling and prevent auto-scroll
    const isNearTop = scrollTop <= 50;
    if (isNearTop && shouldLoadMore) {
      loadMore();
    }

    const distanceFromBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
    setIsUserScrolling(distanceFromBottom > 150); // User is scrolling up
  }, [chatRef, loadMore, shouldLoadMore]);

  // Attach scroll listener
  useEffect(() => {
    const chatContainer = chatRef?.current;
    if (!chatContainer) return;

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [chatRef, handleScroll]);

  // Handle auto-scroll on new messages
  useEffect(() => {
    if (isUserScrolling) return;

    const bottomElement = bottomRef?.current;
    bottomElement?.scrollIntoView({ behavior: "smooth" });
  }, [count, bottomRef, isUserScrolling]);
};
