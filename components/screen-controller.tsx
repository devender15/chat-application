"use client";

import { Profile, DirectMessage } from "@prisma/client";

import VideoScreen from "./video-screen";
import ChatMessages from "./chat-messages";
import ChatInput from "./forms/chat-input";

import { useSearchParams } from "next/navigation";

interface ScreenControllerProps {
  currentMember: Profile;
  otherMember: Profile;
  conversationId: string;
  chats: DirectMessage[];
}

export default function ScreenController({
  currentMember,
  otherMember,
  conversationId,
  chats,
}: ScreenControllerProps) {
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");

  return (
    <>
      {isVideo ? (
        <VideoScreen
          conversationId={conversationId}
          currentMember={currentMember}
          otherMember={otherMember}
        />
      ) : (
        <section className="w-full h-full flex flex-col gap-y-4 justify-center items-center bg-gray-200/90 dark:bg-gray-800  rounded-md shadow-md">
          <ChatMessages
            member={currentMember}
            otherMember={otherMember}
            chatId={conversationId}
            chats={chats}
          />

          <div className="w-[80%] mx-auto">
            <ChatInput
              apiUrl="/api/socket/chats"
              type="conversation"
              otherUser={otherMember}
              query={{
                conversationId: conversationId,
              }}
              currentUser={currentMember}
              conversationId={conversationId}
            />
          </div>
        </section>
      )}
    </>
  );
}
