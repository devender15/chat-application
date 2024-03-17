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

import { handleFetchFriendRequests, handleFetchGroups } from "@/lib/utils";

import { DirectMessage, Group } from "@prisma/client";

type DirectMessageState = Record<string, DirectMessage[]>;

type StateContextType = {
  friendRequests: Profile[];
  setFriendRequests: React.Dispatch<React.SetStateAction<Profile[]>>;
  friendsList: Profile[];
  setFriendsList: React.Dispatch<React.SetStateAction<Profile[]>>;
  groupsList: Group[];
  setGroupsList: React.Dispatch<React.SetStateAction<Group[]>>;
  fetchingFriends: boolean;
  directMessages: DirectMessageState;
  setDirectMessages: React.Dispatch<React.SetStateAction<DirectMessageState>>;
  usersTyping: Record<string, boolean>;
  setUsersTyping: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  editableChat: Record<string, string>;
  setEditableChat: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  messagesSeen: Record<string, boolean>;
  setMessagesSeen: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  fileMessageModal: Record<string, string | Record<string, any>>;
  setFileMessageModal: React.Dispatch<
    React.SetStateAction<Record<string, string | Record<string, any>>>
  >;
  createGroupModal: boolean;
  setCreateGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const StateContext = createContext({} as StateContextType);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const [friendRequests, setFriendRequests] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);
  const [groupsList, setGroupsList] = useState<Group[]>([]);
  const [fetchingFriends, setFetchingFriends] = useState<boolean>(true);
  const [directMessages, setDirectMessages] = useState<DirectMessageState>({});
  const [messagesSeen, setMessagesSeen] = useState<Record<string, boolean>>({});
  const [usersTyping, setUsersTyping] = useState<Record<string, boolean>>({});
  const [editableChat, setEditableChat] = useState<Record<string, string>>({});
  const [fileMessageModal, setFileMessageModal] = useState<
    Record<string, string | Record<string, any>>
  >({
    apiUrl: "",
    query: {},
  });
  const [createGroupModal, setCreateGroupModal] = useState<boolean>(false);

  const { user } = useUser();
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    if (user && socket) {
      handleFetchFriendRequests(setFriendRequests);
      handleGetFriendsList();
      handleFetchGroups(setGroupsList);

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

      socket.on(
        `groupCreateUpdate:${user.id}`,
        ({ message, group }: { message: string; group: Group }) => {

          toast({
            variant: "default",
            description: message,
          });

          console.log(group);

          setGroupsList((prev) => [group, ...prev]);
        }
      );
    }
  }, [user, socket]);

  const handleGetFriendsList = async () => {
    try {
      setFetchingFriends(true);
      const res = await axios.get("/api/friends");
      setFriendsList(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingFriends(false);
    }
  };

  return (
    <StateContext.Provider
      value={{
        friendRequests,
        setFriendRequests,
        friendsList,
        setFriendsList,
        groupsList,
        setGroupsList,
        fetchingFriends,
        directMessages,
        setDirectMessages,
        usersTyping,
        setUsersTyping,
        editableChat,
        setEditableChat,
        fileMessageModal,
        setFileMessageModal,
        messagesSeen,
        setMessagesSeen,
        createGroupModal,
        setCreateGroupModal,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
