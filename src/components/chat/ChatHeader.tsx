import { Hash } from "lucide-react";
import React from "react";
import MobileToggle from "@/components/MobileToggle";
import UserAvatar from "../UserAvatar";
import SocketIndicator from "../SocketIndicator";
import ChatVideoButton from "./ChatVideoButton";

interface ChatHeaderPorps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderPorps) => {
  return (
    <div className="text-muted-foreground font-semibold flex px-3 items-center h-12 border-b">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="h-5 w-5 text-muted-foreground mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="w-7 h-7 mr-2 md:h-7 md:w-7" />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
