"use client";

import { useModal } from "@/hooks/use-modal-store";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Check,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  ShieldQuestion,
  Shield,
  Gavel,
  Loader2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ServerWithMemberWithProfiles } from "@/types";
import UserAvatar from "../UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import { FaUsers } from "react-icons/fa";
import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyyy";
const roleIconMap = {
  GUEST: <Shield className="h-4 w-4 text-gray-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

const MembersModal = () => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMemberWithProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data });
      toast.success(`Role updated to ${role.toLowerCase()}`);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update role");
    } finally {
      setLoadingId(null);
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
      toast.success("Member removed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove member");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background overflow-x-auto max-w-2xl sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaUsers className="w-5 h-5" />
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {server?.members?.length}{" "}
            {server?.members?.length === 1 ? "Member" : "Members"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-xs font-semibold text-muted-foreground text-left py-2 px-4 w-12"></th>
                  <th className="text-xs font-semibold text-muted-foreground text-left py-2 px-4">
                    User
                  </th>
                  <th className="text-xs font-semibold text-muted-foreground text-left py-2 px-4">
                    Role
                  </th>
                  <th className="text-xs font-semibold text-muted-foreground text-left py-2 px-4">
                    Joined
                  </th>
                  <th className="text-xs font-semibold text-muted-foreground text-right py-2 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {server?.members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <UserAvatar
                        src={member.profile.imageUrl}
                        className="h-8 w-8"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {member.profile.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.profile.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-x-2">
                        {roleIconMap[member.role]}
                        <span className="text-sm">
                          {member.role.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(member.createdAt), DATE_FORMAT)}{" "}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {server.profileId !== member.profileId ? (
                        loadingId === member.id ? (
                          <Loader2 className="animate-spin ml-auto w-4 h-4" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <ShieldQuestion className="h-4 w-4 mr-2" />
                                  Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    {Object.entries(roleIconMap).map(
                                      ([role, icon]) => (
                                        <DropdownMenuItem
                                          key={role}
                                          onClick={() =>
                                            onRoleChange(
                                              member.id,
                                              role as MemberRole
                                            )
                                          }
                                          className="flex items-center"
                                        >
                                          {React.cloneElement(icon, {
                                            className: "h-4 w-4 mr-2",
                                          })}
                                          <span>
                                            {role.charAt(0) +
                                              role.slice(1).toLowerCase()}
                                          </span>
                                          {member.role === role && (
                                            <Check className="h-4 w-4 ml-auto" />
                                          )}
                                        </DropdownMenuItem>
                                      )
                                    )}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onKick(member.id)}
                                className="text-rose-500"
                              >
                                <Gavel className="h-4 w-4 mr-2" />
                                Kick
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
// Make it responsive for all screen size device
