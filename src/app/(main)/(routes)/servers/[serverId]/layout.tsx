import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
  children,
  params: rawParams,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // Awaiting the resolution of params explicitly
  const { serverId } = await rawParams;

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) redirect("/");

  return (
    <>
      <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
          <ServerSidebar serverId={serverId} />
        </div>
        <main className="h-full md:pl-60">{children}</main>
      </div>
    </>
  );
};

export default ServerIdLayout;
