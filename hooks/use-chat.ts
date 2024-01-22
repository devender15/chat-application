import { useEffect } from "react";

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
  const { setDirectMessages, directMessages, messagesSeen, setMessagesSeen } = useStateContext();

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
      setMessagesSeen((prev) => {
        return {
          ...prev,
          [data.profile.id]: true,
        };
      });
    })

    return () => {
      socket.off(dmKey);
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
            });
            entry.target.classList.add("animate-bounce");
          } else {
            entry.target.classList.remove("animate-bounce");
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
};
