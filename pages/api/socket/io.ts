import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";

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

          const sender = await db.profile.findFirst({
            where: {
              userId: senderId,
            },
            select: {
              id: true,
              email: true,
            },
          });

          if (!sender) {
            io.to(senderId).emit("friendRequestError", {
              message: "You are not logged in",
            });

            return;
          }

          const reciever = await db.profile.findFirst({
            where: {
              email: receiverEmail,
            },
            select: {
              userId: true,
              id: true,
            },
          });

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
          io.to(receiverSocketId).emit("friendRequest", { senderEmail: sender.email });

          // saving the friend request to the database
          await db.friendRequest.create({
            data: {
              senderId: sender.id,
              receiverId: reciever.id,
            },
          });
        }
      );

      socket.on("acceptFriendRequest", (data) => {
        const { senderId, receiverId } = data;

        // emit the acceptance message
        // if(connectedUsers[senderId]) {
        //   io.to(connectedUsers[senderId]).emit("friendRequestAccepted", { receiverId });
        // }
      });

      socket.on("declineFriendRequest", (data) => {
        const { senderId, receiverId } = data;

        // emit the decline message
        // if(connectedUsers[senderId]) {
        //   io.to(connectedUsers[senderId]).emit("friendRequestDeclined", { receiverId });
        // }
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
