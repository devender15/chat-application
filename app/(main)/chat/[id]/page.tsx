import ChatInput from "@/components/forms/chat-input";

import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import ChatHeader from "@/components/chat-header";
import ChatMessages from "@/components/chat-messages";

interface MemberIdPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
    return;
  }

  // check if the user is our friend or not
  const friend = await db.friend.findFirst({
    where: {
      userId: profile.id,
      friends: {
        some: {
          id: params.id,
        },
      },
    },
  });

  if (!friend) {
    redirect("/chat");
  }

  const conversation = await getOrCreateConversation(profile.id, params.id);

  if (!conversation) {
    redirect("/chat");
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === profile.id ? memberTwo : memberOne;

  // finding the chats of this conversation ( on server )
  const chatsOfThisConversation = await db.directMessage.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="p-10 flex flex-col justify-center items-center gap-y-6 w-full h-full">
      <ChatHeader
        memberName={otherMember.name}
        memberImageUrl={otherMember.imageUrl}
      />

      <section className="w-full h-full flex flex-col gap-y-4 justify-center items-center bg-gray-200/90 dark:bg-gray-800  rounded-md shadow-md">
        <ChatMessages
          member={profile}
          otherMember={otherMember}
          chatId={conversation.id}
          chats={chatsOfThisConversation}
        />

        <div className="w-[80%] mx-auto">
          <ChatInput
            apiUrl="/api/socket/chats"
            type="conversation"
            otherUser={otherMember}
            query={{
              conversationId: conversation.id,
            }}
            currentUser={profile}
            conversationId={conversation.id}
          />
        </div>
      </section>
    </div>
  );
}
