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

  return (
    <div className="px-10 py-6 flex flex-col justify-center items-center gap-y-2 w-full h-full">
      <ChatHeader
        memberName={otherMember.name}
        memberImageUrl={otherMember.imageUrl}
      />

      <ChatMessages
        member={profile}
        otherMember={otherMember}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/dm"
      />

      <div className="w-[80%] mx-auto">
        <ChatInput
          apiUrl="/api/socket/chats"
          type="conversation"
          name={otherMember.name}
          query={{
            conversationId: conversation.id,
          }}
        />
      </div>
    </div>
  );
}
