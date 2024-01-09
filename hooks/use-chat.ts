import { useEffect } from "react";

import { useSocket } from "@/contexts/socket";
import { useStateContext } from "@/contexts/state-context";

import { DirectMessage, Profile } from "@prisma/client";

type useChatProps = {
  dmKey: string;
};

type Message = Profile & DirectMessage;

export const useChat = ({ dmKey }: useChatProps) => {
  const { socket } = useSocket();
  const { directMessages, setDirectMessages } = useStateContext();

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
