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

const connectedUsers: Record<string, string> = {};

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

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("sendFriendRequest", (data) => {
        console.log("sendFriendRequest", data);

        socket.on("sendFriendRequest", async (data) => {
          console.log("sendFriendRequest", data);

          const { senderId, receiverEmail } = data;

          const reciever = await db.profile.findFirst({
            where: {
              email: receiverEmail
            },
            select: {
              id: true
            }
          });

          const receiverId = reciever?.id;

          if(!receiverId) {
            return;
          }

          if(connectedUsers[receiverId]) {
            io.to(connectedUsers[receiverId]).emit("receiveFriendRequest", { senderId });
          }

        })

      })


      socket.on("acceptFriendRequest", (data) => {
        const { senderId, receiverId } = data;

        // emit the acceptance message
        if(connectedUsers[senderId]) {
          io.to(connectedUsers[senderId]).emit("friendRequestAccepted", { receiverId });
        }
      })

      // store the user's socket connection
      socket.on("storeSocketId", (userId) => {
        console.log(userId);
        console.log("user saved!");
        connectedUsers[userId] = socket.id;
      })

      console.log(connectedUsers);

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export default ioHandler;
