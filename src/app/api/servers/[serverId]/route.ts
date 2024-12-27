import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ serverId: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Resolve params before using
    const resolvedParams = await params;
    const server = await db.server.update({
      where: {
        id: resolvedParams.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Resolve params before using
    const resolvedParams = await params;
    const { serverId } = resolvedParams;

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    // Verify server ownership
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) {
      return new NextResponse("Server not found or you're not the owner", {
        status: 403,
      });
    }

    // Delete the server and all related data
    await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return new NextResponse("Server deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[SERVER_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
