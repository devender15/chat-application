import { NextResponse, NextRequest } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // find the friend requests that this user has received from the database
    const friendRequests = await db.friendRequest.findMany({
      where: {
        receiverId: profile.id,
      },
      include: {
        sender: true,
      },
    });

    console.log(friendRequests);

    return new NextResponse(JSON.stringify(friendRequests), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
