"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const Icon = iconMap[channel.type];
  const { onOpen } = useModal();

  const isActive = params?.channelId === channel.id;
  const isGeneral = channel.name === "general";
  const canModify = !isGeneral && role !== MemberRole.GUEST;

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        "relative",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={onClick}
    >
      <Icon
        className={cn(
          "w-5 h-5 flex-shrink-0",
          "text-zinc-500 dark:text-zinc-400",
          isActive && "text-black dark:text-zinc-200"
        )}
      />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm",
          "text-zinc-500 dark:text-zinc-400",
          "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          isActive &&
            "text-black dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>

      {canModify && (
        <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-x-2 transition-opacity">
          <ActionTooltip label="Edit">
            <Edit
              className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("editChannel", { server, channel });
              }}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("deleteChannel", { server, channel });
              }}
            />
          </ActionTooltip>
        </div>
      )}

      {isGeneral && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
