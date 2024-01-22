"use client";

import { motion as m } from "framer-motion";

import { Profile, DirectMessage } from "@prisma/client";
import { useChat } from "@/hooks/use-chat";
import { useStateContext } from "@/contexts/state-context";
import ChatBubble from "./chat-bubble";
import { ThreeDots } from "react-loader-spinner";
import { useRef } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Pencil, Copy, Trash2 } from "lucide-react";

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
  const { directMessages, usersTyping, messagesSeen } = useStateContext();

  const messageRef = useRef<HTMLDivElement>(null);

  const dmKey = `chat:${chatId}:messages`;

  useChat({ dmKey, chats, messageRef, chatId, member, otherMember });

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isRightSide = (messageProfileId: string) => {
    return messageProfileId === member.id;
  };

  const handleShowSeenMessage = () => {
    console.log(!directMessages[chatId]);
    if (!directMessages[chatId]) return;

    return (
      directMessages[chatId][directMessages[chatId]?.length - 1].profileId ===
        member.id && messagesSeen[otherMember.id]
    );
  };

  return (
    <div className="bg-gray-200/90 dark:bg-gray-800  rounded-sm shadow-md p-4 w-full h-full max-h-full overflow-y-auto">
      <div className="w-full space-y-2 text-white">
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
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  {message.profileId !== otherMember.id ? (
                    <ChatBubble message={message} direction="right" />
                  ) : (
                    <ChatBubble message={message} direction="left" />
                  )}
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {message.profileId === member.id ? (
                    <>
                      <ContextMenuItem className="w-full h-full flex justify-center items-center gap-x-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-left">
                        <Pencil className="h-5 w-5" />
                        Edit
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleCopyText(message.content)}
                        className="w-full h-full flex justify-center items-center gap-x-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-left"
                      >
                        <Copy className="h-5 w-5" />
                        Copy
                      </ContextMenuItem>
                      <ContextMenuItem className="w-full h-full flex justify-center items-center gap-x-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-left">
                        <Trash2 className="h-5 w-5" />
                        Delete
                      </ContextMenuItem>
                    </>
                  ) : (
                    <ContextMenuItem
                      onClick={() => handleCopyText(message.content)}
                      className="w-full h-full flex justify-center items-center gap-x-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-left"
                    >
                      <Copy className="h-5 w-5" />
                      Copy
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            </m.div>
          );
        })}
        {handleShowSeenMessage() && (
          <p className="flex justify-end text-gray-400 text-sm font-bold">
            seen
          </p>
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
