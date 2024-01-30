import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import ChatHeader from "@/components/chat-header";

interface MemberIdPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) redirect("/video");

  const otherMember = await db.profile.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!otherMember) redirect("/video");

  return (
    <div className="px-10 py-6 flex flex-col justify-center items-center gap-y-2 w-full h-full">
      <ChatHeader
        memberImageUrl={otherMember?.imageUrl}
        memberName={otherMember.name}
      />
    </div>
  );
}
