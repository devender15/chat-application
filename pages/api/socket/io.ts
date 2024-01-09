import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

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
