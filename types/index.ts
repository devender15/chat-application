import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  }
}

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type Friend = Pick<
FriendRequest["sender"],
"id" | "name" | "email" | "imageUrl" | "createdAt" | "userId" | "updatedAt"
>;