import { NextResponse, NextRequest } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // find the friend requests that this user has received from the database
    const friendRequestsFromDB = await db.friendRequest.findMany({
      where: {
        receiverId: profile.id,
      },
      select: {
        sender: true,
      },
    });

    const friendRequests: Profile[] = friendRequestsFromDB.map(request => request.sender);

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
