import { DirectMessage } from "@prisma/client";

import { Pencil, Copy, Trash2 } from "lucide-react";
import axios from "axios";
import qs from "query-string";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type ChatBubbleProps = {
  message: DirectMessage;
  direction: "left" | "right";
};

export default function ChatBubble({ message, direction }: ChatBubbleProps) {
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDeleteChat = async (id: string) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/socket/${id}`,
        query: { conversationId: message.conversationId },
      });

      const resp = await axios.delete(url);
      console.log(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex items-start gap-2.5 max-w-[40%] break-words">
          <div
            className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 ${
              direction === "right" ? "rounded-ss-xl" : "rounded-se-xl"
            }  rounded-ee-xl rounded-es-xl dark:bg-gray-700`}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Bonnie Green
          </span> */}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {message.createdAt.toLocaleString().split(",")[1]}
              </span>
            </div>
            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
              {message.content}
            </p>
            {direction === "right" && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Delivered
              </span>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {direction === "right" ? (
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
            <ContextMenuItem
              onClick={() => handleDeleteChat(message.id)}
              className="w-full h-full flex justify-center items-center gap-x-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-left"
            >
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
  );
}
