"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../UserAvatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleMapIcon = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-primary" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-destructive" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleMapIcon[member.role];
  const isActive = params?.memberId === member.id;

  const handleClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        "relative",
        isActive && "bg-zinc-700/10 dark:bg-zinc-700"
      )}
    >
      <div className="relative flex items-center">
        <UserAvatar
          src={member.profile.imageUrl}
          className="h-8 w-8 md:h-8 md:w-8 ring-2 ring-background"
        />
        {member.role !== MemberRole.GUEST && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start">
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm",
            "text-zinc-500 dark:text-zinc-400",
            "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
            isActive &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {member.profile.name}
        </p>
        {member.role !== MemberRole.GUEST && (
          <span className="text-xs text-muted-foreground capitalize">
            {member.role.toLowerCase()}
          </span>
        )}
      </div>
    </button>
  );
};

export default ServerMember;
