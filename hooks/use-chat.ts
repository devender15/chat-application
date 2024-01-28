import { useEffect, useState } from "react";

import { useSocket } from "@/contexts/socket";
import { useStateContext } from "@/contexts/state-context";

import { DirectMessage, Profile } from "@prisma/client";

type useChatProps = {
  dmKey: string;
  chats: DirectMessage[];
  messageRef: React.RefObject<HTMLDivElement>;
  chatId: string;
  member: Profile;
  otherMember: Profile;
};

type Message = Profile & DirectMessage;

export const useChat = ({
  dmKey,
  chats,
  messageRef,
  chatId,
  member,
  otherMember,
}: useChatProps) => {
  const { socket } = useSocket();
  const { setDirectMessages, directMessages } = useStateContext();

  const [showSeen, setShowSeen] = useState(false);

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

    // @ts-ignore
    socket.on(`messageSeen:${chatId}:${otherMember.id}`, (data) => {
      if (
        directMessages[chatId][directMessages[chatId].length - 1].profileId ===
        member.id
      ) {
        setShowSeen(true);
      }
    });

    socket.on(`updateChat:${chatId}`, (data: DirectMessage) => {
      setDirectMessages((prev) => {
        let prevMessagesOfAParticularConversation = prev[chatId] || [];
        prevMessagesOfAParticularConversation =
          prevMessagesOfAParticularConversation.map((message) => {
            if (message.id === data.id) {
              return data;
            }
            return message;
          });
        return {
          ...prev,
          [chatId]: prevMessagesOfAParticularConversation,
        };
      });
    });

    return () => {
      socket.off(dmKey);
      socket.off(`messageSeen:${chatId}:${otherMember.id}`);
    };
  }, [socket]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            socket.emit("messageSeen", {
              conversationId: chatId,
              profile: member,
              messageId:
                directMessages[chatId][directMessages[chatId].length - 1].id,
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [directMessages[chatId]]);

  useEffect(() => {
    if (!directMessages[chatId]) return;

    const lastMessage =
      directMessages[chatId][directMessages[chatId].length - 1];

    if (lastMessage?.seen && lastMessage?.profileId === member.id) {
      setShowSeen(true);
    } else {
      setShowSeen(false);
    }
  }, [directMessages]);

  return { showSeen };
};
