import ChatInput from "@/components/forms/chat-input";

import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

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

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    redirect("/chat");
    return;
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.id
  );

  if (!conversation) {
    redirect("/chat");
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === currentMember.id ? memberTwo : memberOne;

  return (
    <div className="px-10 py-6 flex flex-col justify-center items-center gap-y-2 w-full h-full">
      <ChatHeader
        memberName={memberOne.profile.name}
        memberImageUrl={memberOne.profile.imageUrl}
      />
      <div className="bg-gray-200/90 dark:bg-gray-800  rounded-sm shadow-md p-4 w-full h-full max-h-full overflow-y-auto">
        <div className="w-full space-y-2 text-white">
          <div className="flex justify-start">
            <p className="max-w-[40%] break-words p-2 rounded-sm bg-green-800">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur quisquam possimus ab, reprehenderit delectus quos
              asperiores blanditiis, unde repellendus assumenda voluptatibus
              rerum. Deserunt nisi rem voluptatibus facilis ipsam quas maxime
              suscipit, provident odio, explicabo tenetur corrupti laborum
              repellendus nemo, totam iusto eaque temporibus quibusdam animi
              omnis atque saepe voluptatem. Dolor blanditiis at cupiditate!
              Ratione eveniet quia quae perspiciatis, voluptate dicta quas
              possimus laboriosam error dolorem dolores cumque! Repellendus
              itaque cumque illo magni ad pariatur accusamus minima, non maiores
              iste sit nemo possimus sapiente eligendi. Facilis, minus inventore
              magnam, blanditiis nulla earum sunt sint vero repellat distinctio
              fugiat, sequi excepturi similique.
            </p>
          </div>
          <div className="flex justify-start">
            <p className="max-w-[40%] break-words p-2 rounded-sm bg-green-800">
              Lorem, ipsum dolor sit amet
            </p>
          </div>
          <div className=" flex justify-end">
            <p className="max-w-[40%] break-words bg-gray-900 p-2 rounded-sm">
              laborum repellendus nemo, totam iusto eaque temporibus quibusdam
              animi omnis atque saepe voluptatem. Dolor blanditiis at
              cupiditate! Ratione eveniet quia quae perspiciatis, voluptate
              dicta quas possimus laboriosam error dolorem dolores cumque!
              Repellendus itaque cumque illo magni ad pariatur accusamus minima,
              non maiores iste sit nemo possimus sapiente eligendi. Facilis,
              minus inventore magnam, blanditiis nulla earum sunt sint vero
              repellat distinctio fugiat, sequi excepturi similique
            </p>
          </div>
          <div className="flex justify-end">
            <p className="max-w-[40%] break-words p-2 rounded-sm bg-gray-900">
              Lorem, ipsum dolor sit amet
            </p>
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto">
        <ChatMessages
          member={currentMember}
          name={otherMember.profile.name}
          chatId={conversation.id}
          type="conversation"
          apiUrl="/api/dm"
          socketUrl="/api/socket/chats"
          paramKey="conversationId"
          paramValue={conversation.id}
          socketQuery={{
            conversationId: conversation.id,
          }}
        />
        <ChatInput
          apiUrl="/api/socket/chats"
          type="conversation"
          name={otherMember.profile.name}
          query={{
            conversationId: conversation.id,
          }}
        />
      </div>
    </div>
  );
}
