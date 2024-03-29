"use client";

import { motion as m } from "framer-motion";

import { Profile, DirectMessage } from "@prisma/client";
import { useChat } from "@/hooks/use-chat";
import { useStateContext } from "@/contexts/state-context";
import ChatBubble from "./chat-bubble";
import { ThreeDots } from "react-loader-spinner";
import { useRef, useEffect } from "react";

import { MoveDown } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessagesProps {
  member: Profile;
  otherMember: Profile;
  chatId: string;
  chats: DirectMessage[];
}

export default function ChatMessages({
  member,
  otherMember,
  chatId,
  chats,
}: ChatMessagesProps) {
  const { directMessages, usersTyping } = useStateContext();

  const messageRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const dmKey = `chat:${chatId}:${member.id}:messages`;

  const { showSeen, showScrollToBottomButton } = useChat({
    dmKey,
    chats,
    messageRef,
    chatId,
    member,
    otherMember,
  });

  const isRightSide = (messageProfileId: string) => {
    return messageProfileId === member.id;
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef?.current?.scrollHeight;
    }
  }, [directMessages[chatId]]);

  return (
    <div
      ref={chatContainerRef}
      className="p-4 w-full h-full max-h-full overflow-y-auto"
    >
      <div className="w-full space-y-2 text-white relative">
        {directMessages[chatId]?.map((message) => {
          return (
            <m.div
              initial={{
                opacity: 0,
                y: isRightSide(message.profileId) ? 40 : -40,
                x: -20,
              }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.2,
              }}
              key={message.id}
              className={`flex ${
                message.profileId === otherMember.id
                  ? "justify-start"
                  : "justify-end"
              }`}
              ref={message.profileId === otherMember.id ? messageRef : null}
            >
              <ChatBubble
                message={message}
                direction={
                  message.profileId !== otherMember.id ? "right" : "left"
                }
              />
            </m.div>
          );
        })}
        {showSeen && (
          <p className="flex justify-end text-gray-400 text-xs font-semibold italic">
            seen
          </p>
        )}

        {showScrollToBottomButton && (
          <div className="fixed bottom-12 right-14">
            <Button size="icon" onClick={scrollToBottom}>
              <MoveDown size={20} />
            </Button>
          </div>
        )}

        {usersTyping[otherMember.id] && (
          <ThreeDots
            height="60"
            width="60"
            radius="9"
            color="gray"
            ariaLabel="three-dots-loading"
            visible={true}
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
      </div>
    </div>
  );
}
