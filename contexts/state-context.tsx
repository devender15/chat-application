"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Profile } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

import { useUser } from "@clerk/nextjs";
import { useSocket } from "./socket";

import { handleFetchFriendRequests } from "@/lib/utils";

import { DirectMessage } from "@prisma/client";

type StateContextType = {
  friendRequests: Profile[];
  setFriendRequests: React.Dispatch<React.SetStateAction<Profile[]>>;
  friendsList: Profile[];
  setFriendsList: React.Dispatch<React.SetStateAction<Profile[]>>;
  directMessages: DirectMessage[];
  setDirectMessages: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
};

export const StateContext = createContext({} as StateContextType);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const [friendRequests, setFriendRequests] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);

  const { user } = useUser();
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    if (user && socket) {
      handleFetchFriendRequests(setFriendRequests);
      handleGetFriendsList();

      // socket.emit("joinRoom", { userId: user.id });

      socket.on(`sendFriendRequest:${user.id}`, (data: Profile) => {
        setFriendRequests((prev) => [...prev, data]);

        toast({
          variant: "default",
          title: "New Friend Request",
          description: `${data.email} has sent you a friend request!`,
        });
      });

      socket.on(
        "friendRequestAccepted",
        async (data: { acceptorEmail: string }) => {
          toast({
            variant: "default",
            title: "Friend Request Accepted",
            description: `${data.acceptorEmail} has accepted your friend request!`,
          });

          await handleGetFriendsList();
          await handleFetchFriendRequests(setFriendRequests);
        }
      );

      socket.on("friendRequestDeclined", (data: { message: string }) => {
        toast({
          variant: "default",
          title: "Friend Request Declined",
          description: data.message,
        });
      });
    }
  }, [user, socket]);

  const handleGetFriendsList = async () => {
    const res = await axios.get("/api/friends");
    setFriendsList(res.data);
  };

  return (
    <StateContext.Provider
      value={{
        friendRequests,
        setFriendRequests,
        friendsList,
        setFriendsList,
        directMessages,
        setDirectMessages,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
