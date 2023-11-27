import { User as FirebaseUser } from "firebase/auth";
import { type Dispatch } from "react";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type UserAuthContextType = [
    FirebaseUser | null,
    Dispatch<React.SetStateAction<FirebaseUser | null>>
  ];

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  }
}