import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import ChatHeader from "@/components/chat-header";
import ScreenController from "@/components/screen-controller";

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

      <ScreenController
        currentMember={profile}
        otherMember={otherMember}
        chats={chatsOfThisConversation}
        conversationId={conversation.id}
      />
    </div>
  );
}
