import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const friends = await db.friend.findFirst({
      where: {
        userId: profile.id,
      },
      select: {
        friends: true,
      },
    });

    if(!friends) {
        // return empty array if no friends
        return new NextResponse(JSON.stringify([]), {
            headers: {
              "Content-Type": "application/json",
            },
          });
    }

    return new NextResponse(JSON.stringify(friends.friends), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
