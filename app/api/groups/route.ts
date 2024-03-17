import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const groups = await db.group.findMany({
      where: {
        OR: [
          {
            adminId: profile.id,
          },
          {
            members: {
              some: {
                userId: profile.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        admin: true,
        members: true,
      },
    });

    console.log(groups);

    if (!groups) {
      // return empty array if no groups
      return new NextResponse(JSON.stringify([]), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(groups), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
