"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useUser } from "@clerk/nextjs";

import { useSocket } from "./socket";

import { handleFetchFriendRequests } from "@/lib/utils";

type StateContextType = {
  friendRequests: any[];
  setFriendRequests: React.Dispatch<React.SetStateAction<never[]>>;
};

export const StateContext = createContext({} as StateContextType);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const [friendRequests, setFriendRequests] = useState([]);

  const { user } = useUser();

  const { socket } = useSocket();

  useEffect(() => {
    if (user && socket) {


      handleFetchFriendRequests(setFriendRequests);

      socket.emit("joinRoom", { userId: user.id });

      socket.on("userJoinedRoom", (data: { message: string, usersInRoom?: any }) => {
        const { message, usersInRoom } = data;
        // console.log(message);
        // console.log(usersInRoom);
      });
    }


  }, [user, socket]);

  return (
    <StateContext.Provider value={{ friendRequests, setFriendRequests }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
