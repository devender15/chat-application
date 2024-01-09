import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

// import { findIdFromUid } from "@/lib/find-id-from-uid";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { receiverEmail, type } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const receiver = await db.profile.findFirst({
      where: {
        email: receiverEmail as string,
      },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found!" });
    }

    // check if the receiver is already a friend

    // check if the current user has already sent a friend request
    const requestExists = await db.friendRequest.findFirst({
      where: {
        senderId: profile.id,
        receiverId: receiver.id,
      },
    });

    if (requestExists) {
      return res.status(400).json({ message: "Request already sent" });
    }

    switch (type) {
      case "send":
        await db.friendRequest.create({
          data: {
            senderId: profile.id,
            receiverId: receiver.id,
          },
        });

        const sendFriendRequestKey = `sendFriendRequest:${receiver.userId}`;

        res?.socket?.server?.io?.emit(sendFriendRequestKey, profile);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
