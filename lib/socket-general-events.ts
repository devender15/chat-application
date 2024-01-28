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
};
