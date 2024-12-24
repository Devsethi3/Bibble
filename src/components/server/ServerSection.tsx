"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  server,
  channelType,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between py-2">
        <p className="text-xs uppercase font-semibold text-muted-foreground">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() => onOpen("createChannel",{channelType})}
              className="text-muted-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage Members" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-muted-foreground"
            >
              <Settings className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      </div>
    </>
  );
};

export default ServerSection;
