import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { findIdFromUid } from "@/lib/find-id-from-uid";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("a user connected");

      socket.on("joinRoom", (data) => {
        const { userId } = data;

        // add the user to the room
        socket.join(userId);

        socket.emit("userJoinedRoom", {
          message: "You have joined the global room",
          usersInRoom: io.sockets.adapter.rooms,
        });

        // checking the users in the room
        // const { rooms } = io.sockets.adapter;
        // console.log(rooms);
      });

      socket.on(
        "sendFriendRequest",
        async (data: { senderId: string; receiverEmail: string }) => {
          const { senderId, receiverEmail } = data;

          const sender = await findIdFromUid(senderId);

          if (!sender) {
            io.to(senderId).emit("friendRequestError", {
              message: "You are not logged in",
            });

            return;
          }

          const reciever = await findIdFromUid(undefined, receiverEmail);

          if (!reciever) {
            io.to(senderId).emit("friendRequestError", {
              message: "User not found",
            });

            return;
          }

          // check if a request has already been sent
          const requestExists = await db.friendRequest.findFirst({
            where: {
              senderId: sender.id,
              receiverId: reciever.id,
            },
          });

          if (requestExists) {
            io.to(senderId).emit("friendRequestError", {
              message: "Request already sent",
            });

            return;
          }

          const receiverId = reciever.userId;

          if (!receiverId) {
            // find the user's socket id from the room
            io.to(senderId).emit("friendRequestError", {
              message: "User not found",
            });

            return;
          }

          const { rooms } = io.sockets.adapter;

          const idSet = rooms.get(receiverId);

          if (!idSet) {
            io.to(senderId).emit("friendRequestError", {
              message: "This user is not online",
            });

            return;
          }

          const receiverSocketId = rooms.get(receiverId)
            ? Array.from(idSet.values())[0]
            : null;

          if (!receiverSocketId) {
            io.to(senderId).emit("friendRequestError", {
              message: "This user is not online",
            });

            return;
          }

          // emit the friend request
          io.to(receiverSocketId).emit("friendRequest", {
            senderEmail: sender.email,
          });

          // saving the friend request to the database
          await db.friendRequest.create({
            data: {
              senderId: sender.id,
              receiverId: reciever.id,
            },
          });
        }
      );

      socket.on("acceptFriendRequest", async (data) => {
        const { accepted, acceptor } = data;

        const acceptorProfile = await findIdFromUid(acceptor);
        const acceptedProfile = await findIdFromUid(accepted);

        const friendRequestSentBySender = await db.friendRequest.findFirst({
          where: {
            AND: [{ senderId: accepted }, { receiverId: acceptorProfile?.id }],
          },
        });

        if (!friendRequestSentBySender) {
          io.to(acceptor).emit("friendRequestError", {
            message: "Friend request not found",
          });

          return;
        }

        if (!acceptedProfile) {
          io.to(acceptor).emit("friendRequestError", {
            message: "User not found",
          });

          return;
        }

        // delete the friend request which the sender sent
        await db.friendRequest.delete({
          where: {
            id: friendRequestSentBySender.id,
          },
        });

        // check if the acceptor has already sent a friend request to the accepted
        const friendRequestSentByAcceptor = await db.friendRequest.findFirst({
          where: {
            AND: [{ senderId: acceptorProfile?.id }, { receiverId: accepted }],
          },
        });

        if (friendRequestSentByAcceptor) {
          // delete the friend request which the acceptor sent
          await db.friendRequest.delete({
            where: {
              id: friendRequestSentByAcceptor.id,
            },
          });
        }

        // check first if this users' entry already exists in the friend table
        const userAlreadyExists = await db.friend.findFirst({
          where: {
            userId: acceptorProfile?.id!,
          },
        });

        if (userAlreadyExists) {
          // dont create a new entry instead just update the friends list
          await db.friend.update({
            where: {
              userId: acceptorProfile?.id!,
            },
            data: {
              friends: {
                connect: {
                  id: accepted,
                },
              },
            },
          });
        } else {
          // add the users to each other's friend list
          await db.friend.create({
            data: {
              userId: acceptorProfile?.id!,
              friends: {
                connect: {
                  id: accepted,
                },
              },
            },
          });
        }

        // do above operation for the accepted user
        const acceptedUserEntryExistsInFriends = await db.friend.findFirst({
          where: {
            userId: accepted,
          },
        });

        if (acceptedUserEntryExistsInFriends) {
          // dont create a new entry instead just update the friends list
          await db.friend.update({
            where: {
              userId: accepted,
            },
            data: {
              friends: {
                connect: {
                  id: acceptorProfile?.id!,
                },
              },
            },
          });
        } else {
          // add the users to each other's friend list
          await db.friend.create({
            data: {
              userId: accepted,
              friends: {
                connect: {
                  id: acceptorProfile?.id!,
                },
              },
            },
          });
        }

        // emit the accept message
        io.to(acceptedProfile.userId).emit("friendRequestAccepted", {
          acceptorEmail: acceptorProfile?.email,
        });
      });

      socket.on("rejectFriendRequest", async (data) => {
        const { rejected, rejector } = data;

        const rejectorProfile = await findIdFromUid(rejector);

        if (!rejectorProfile) {
          io.to(rejector).emit("friendRequestError", {
            message: "Your info is not found",
          });

          return;
        }

        // delete the friend request which the sender sent
        const friendRequestSentBySender = await db.friendRequest.findFirst({
          where: {
            AND: [{ senderId: rejected }, { receiverId: rejectorProfile.id }],
          },
          select: {
            id: true,
          },
        });

        if (!friendRequestSentBySender) {
          io.to(rejector).emit("friendRequestError", {
            message: "Friend request not found",
          });

          return;
        }

        await db.friendRequest.delete({
          where: {
            id: friendRequestSentBySender.id,
          },
        });

        // emit the decline message
        io.to(rejector).emit("friendRequestDeclined", {
          message: "success",
        });
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");

        // clear the room
        // socket.leave(userId);
      });
    });
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export default ioHandler;
