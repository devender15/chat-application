import { Server as ServerIO, Socket } from "socket.io";

import { db } from "./db";

export const handleSocketGeneralEvents = (socket: Socket, io: ServerIO) => {
  socket.on("typing", (data) => {
    io.emit(`isTyping:${data.conversationId}:${data.profile.id}`, data);
  });

  socket.on("messageSeen", async (data) => {
    const messageId = data.messageId;

    await db.directMessage.update({
      where: {
        id: messageId,
      },
      data: {
        seen: true,
      },
    });

    io.emit(`messageSeen:${data.conversationId}:${data.profile.id}`, data);
  });

  // handling webrtc events using this signal server
  socket.on("roomJoin", (data) => {
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(data.roomId);

    if (!room) {
      socket.join(data.roomId);
      socket.emit(`roomCreated:${data.roomId}`, data);
    } else if (room.size === 1) {
      socket.join(data.roomId);
      socket.emit(`roomJoined:${data.roomId}`, data);
    } else {
      socket.emit(`roomFull:${data.roomId}`, data);
    }

    console.log(rooms);
  });


  socket.on("ready", (data) => {
    socket.broadcast.to(data.roomId).emit(`ready:${data.roomId}`);
  });

  socket.on("ice-candidate", (candidate: RTCIceCandidate, roomId: string) => {
    socket.broadcast.to(roomId).emit(`icecandidate:${roomId}`, candidate);
  });

  socket.on("offer", (offer, roomId) => {
    socket.broadcast.to(roomId).emit(`offer:${roomId}`, offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.broadcast.to(roomId).emit(`answer:${roomId}`, answer);
  });

  socket.on("leave", (data) => {
    socket.broadcast.to(data.roomId).emit(`leave:${data.roomId}`);
    socket.leave(data.roomId);
  });
};
