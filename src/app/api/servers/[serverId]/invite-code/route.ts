import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// interface RouteContext {
//   params: Promise<{ serverId: string; profileId: string }>;
// }

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized: No profile found", {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Bad Request: Server ID is required", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId as string,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    if (!server) {
      return new NextResponse("Server not found or you're not a member", {
        status: 404,
      });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
