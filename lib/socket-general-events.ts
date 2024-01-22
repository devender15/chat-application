import { Server as ServerIO, Socket } from "socket.io";

export const handleSocketGeneralEvents = (socket: Socket, io: ServerIO) => {
  socket.on("typing", (data) => {
    io.emit(`isTyping:${data.conversationId}:${data.profile.id}`, data);
  });

  socket.on("messageSeen", (data) => {
    io.emit(`messageSeen:${data.conversationId}:${data.profile.id}`, data);
  });
};
