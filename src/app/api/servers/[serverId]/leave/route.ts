import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ serverId: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Resolve the params promise before using it
    const resolvedParams = await params;
    const { serverId } = resolvedParams;

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (server) {
      return new NextResponse("You cannot leave your own server", {
        status: 400,
      });
    }

    // Delete the member directly
    await db.member.deleteMany({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    return new NextResponse("Successfully left the server", { status: 200 });
  } catch (error) {
    console.error("[SERVER_ID_LEAVE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
