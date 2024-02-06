import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoButton from "./video-button";

interface ChatHeaderProps {
  memberName: string;
  memberImageUrl: string;
}

export default function ChatHeader({
  memberName,
  memberImageUrl,
}: ChatHeaderProps) {
  return (
    <div className="flex justify-between w-full items-center">
      <div className="flex items-center gap-x-3">
        <Avatar>
          <AvatarImage src={memberImageUrl} />
          <AvatarFallback>{memberName}</AvatarFallback>
        </Avatar>

        <p className="font-semibold">{memberName}</p>
      </div>
      <div>
        <VideoButton />
      </div>
    </div>
  );
}
