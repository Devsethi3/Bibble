import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ memberId: string }>;
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const { memberId } = await params;
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
    if (!memberId) return new NextResponse("Member ID missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const patchMemberSchema = z.object({
  role: z.enum(["GUEST", "MODERATOR", "ADMIN"]),
});

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { memberId } = await params;
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
    if (!memberId) return new NextResponse("Member ID missing", { status: 400 });

    const body = await req.json();
    const validatedBody = patchMemberSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      include: {
        members: true,
      },
    });

    if (!server) return new NextResponse("Server not found", { status: 404 });

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: validatedBody.data.role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error("[MEMBER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}