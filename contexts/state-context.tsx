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

type DirectMessageState = Record<string, DirectMessage[]>;

type StateContextType = {
  friendRequests: Profile[];
  setFriendRequests: React.Dispatch<React.SetStateAction<Profile[]>>;
  friendsList: Profile[];
  setFriendsList: React.Dispatch<React.SetStateAction<Profile[]>>;
  directMessages: DirectMessageState;
  setDirectMessages: React.Dispatch<React.SetStateAction<DirectMessageState>>;
  usersTyping: Record<string, boolean>;
  setUsersTyping: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export const StateContext = createContext({} as StateContextType);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const [friendRequests, setFriendRequests] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessageState>({});
  const [usersTyping, setUsersTyping] = useState<Record<string, boolean>>({});

  const { user } = useUser();
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    if (user && socket) {
      handleFetchFriendRequests(setFriendRequests);
      handleGetFriendsList();

      socket.on(`sendFriendRequest:${user.id}`, (data: Profile) => {
        setFriendRequests((prev) => [...prev, data]);

        toast({
          variant: "default",
          title: "New Friend Request",
          description: `${data.email} has sent you a friend request!`,
        });
      });

      socket.on(`acceptFriendRequest:${user.id}`, (data: Profile) => {
        setFriendsList((prev) => [data, ...prev]);

        toast({
          variant: "default",
          title: "Friend Request Accepted",
          description: `${data.email} has accepted your friend request!`,
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
        usersTyping,
        setUsersTyping,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
