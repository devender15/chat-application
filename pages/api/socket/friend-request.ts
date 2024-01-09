import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { Profile } from "@prisma/client";
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
        break;

      case "accept":
        const { acceptedRequest } = req.body;

        console.log(acceptedRequest);

        if (!acceptedRequest) {
          return res.status(400).json({ message: "Invalid request" });
        }

        const friendRequestSentBySender = await db.friendRequest.findFirst({
          where: {
            senderId: acceptedRequest.id,
            receiverId: profile.id,
          },
        });

        if (!friendRequestSentBySender) {
          return res.status(400).json({ message: "Invalid request" });
        }

        await db.friendRequest.delete({
          where: {
            id: friendRequestSentBySender.id,
          },
        });

        const friendRequestSendByAcceptor = await db.friendRequest.findFirst({
          where: {
            senderId: profile.id,
            receiverId: acceptedRequest.id,
          },
        });

        if (friendRequestSendByAcceptor) {
          await db.friendRequest.delete({
            where: {
              id: friendRequestSendByAcceptor.id,
            },
          });
        }

        // check first if this users' entry already exists in the friend table
        const userAlreadyExists = await db.friend.findFirst({
          where: {
            userId: profile.id!,
          },
        });

        if (userAlreadyExists) {
          // dont create a new entry instead just update the friends list
          await db.friend.update({
            where: {
              userId: profile.id!,
            },
            data: {
              friends: {
                connect: {
                  id: acceptedRequest.id,
                },
              },
            },
          });
        } else {
          // add the users to each other's friend list
          await db.friend.create({
            data: {
              userId: profile.id!,
              friends: {
                connect: {
                  id: acceptedRequest.id,
                },
              },
            },
          });
        }

        // do above operation for the accepted user
        const acceptedUserEntryExistsInFriends = await db.friend.findFirst({
          where: {
            userId: acceptedRequest.id,
          },
        });

        if (acceptedUserEntryExistsInFriends) {
          // dont create a new entry instead just update the friends list
          await db.friend.update({
            where: {
              userId: acceptedRequest.id,
            },
            data: {
              friends: {
                connect: {
                  id: profile.id!,
                },
              },
            },
          });
        } else {
          // add the users to each other's friend list
          await db.friend.create({
            data: {
              userId: acceptedRequest.id,
              friends: {
                connect: {
                  id: profile.id!,
                },
              },
            },
          });
        }

        const acceptFriendRequestKey = `acceptFriendRequest:${acceptedRequest.userId}`;

        console.log(acceptFriendRequestKey);

        res?.socket?.server?.io?.emit(acceptFriendRequestKey, profile);
        break;

      case "reject":
        const { rejectedRequest } = req.body;

        if (!rejectedRequest) {
          return res.status(400).json({ message: "Invalid request" });
        }

        const friendRequestSentBySenderToReject =
          await db.friendRequest.findFirst({
            where: {
              senderId: rejectedRequest.id,
              receiverId: profile.id,
            },
          });

        if (!friendRequestSentBySenderToReject) {
          return res.status(400).json({ message: "Invalid request" });
        }

        await db.friendRequest.delete({
          where: {
            id: friendRequestSentBySenderToReject.id,
          },
        });

        return res.status(200).json({ message: "Request rejected" });

      default:
        return res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
