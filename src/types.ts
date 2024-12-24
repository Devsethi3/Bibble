import { Server, Member, Profile } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
