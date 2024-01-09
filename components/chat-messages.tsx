"use client";

import { motion as m } from "framer-motion";

import { Profile } from "@prisma/client";
import { useChat } from "@/hooks/use-chat";
import { useStateContext } from "@/contexts/state-context";

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
  apiUrl: string;
  type: "conversation";
}

export default function ChatMessages({
  member,
  otherMember,
  chatId,
  apiUrl,
  type,
}: ChatMessagesProps) {
  const dmKey = `chat:${chatId}:messages`;
  useChat({ dmKey });

  const { directMessages } = useStateContext();

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isRightSide = (messageProfileId: string) => {
    return messageProfileId === member.id;
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
                duration: 0.5,
              }}
              key={message.id}
              className={`flex ${
                message.profileId === otherMember.id
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <p className="max-w-[40%] break-words p-2 rounded-sm bg-green-800">
                    {message.content}
                  </p>
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
      </div>
    </div>
  );
}
