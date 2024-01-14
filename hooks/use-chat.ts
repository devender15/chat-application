import { useEffect } from "react";

import { useSocket } from "@/contexts/socket";
import { useStateContext } from "@/contexts/state-context";

import { DirectMessage, Profile } from "@prisma/client";

type useChatProps = {
  dmKey: string;
  chats: DirectMessage[];
};

type Message = Profile & DirectMessage;

export const useChat = ({ dmKey, chats }: useChatProps) => {
  const { socket } = useSocket();
  const { setDirectMessages } = useStateContext();

  // render the older messages
  useEffect(() => {
    if (!chats) return;

    const conversationId = chats[0]?.conversationId;

    setDirectMessages((prev) => {
      return {
        ...prev,
        [conversationId]: chats,
      };
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(dmKey, (message: Message) => {
      const conversationId = message.conversationId;
      setDirectMessages((prev) => {
        const prevMessagesOfAParticularConversation =
          prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: [...prevMessagesOfAParticularConversation, message],
        };
      });
    });

    return () => {
      socket.off(dmKey);
    };
  }, [socket]);
};
