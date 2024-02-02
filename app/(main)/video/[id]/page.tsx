import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

import VideoScreen from "@/components/video-screen";

interface MemberIdPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) redirect("/video");

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
    redirect("/video");
  }

  const conversation = await getOrCreateConversation(profile.id, params.id);

  if (!conversation) {
    redirect("/video");
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === profile.id ? memberTwo : memberOne;

  return (
    <div className="px-10 py-6 flex flex-col justify-center items-center gap-y-2 w-full h-full">
      <VideoScreen conversationId={conversation.id} currentMember={profile} otherMember={otherMember} />
    </div>
  );
}
