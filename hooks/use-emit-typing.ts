import { useSocket } from "@/contexts/socket";
import { useEffect } from "react";
import { Profile } from "@prisma/client";
import { useStateContext } from "@/contexts/state-context";

type EmitTypingProps = {
  conversationId: string;
  currentProfile: Profile;
  otherUserProfile: Profile;
  hasStartedTyping: boolean;
};

export const useEmitTyping = ({
  conversationId,
  currentProfile,
  otherUserProfile,
  hasStartedTyping,
}: EmitTypingProps) => {
  const { socket } = useSocket();

  const { setUsersTyping } = useStateContext();

  useEffect(() => {
    if (!socket) return;

    socket.emit("typing", {
      conversationId,
      profile: currentProfile,
      typing: hasStartedTyping,
    });

    return () => {
      socket.off("typing");
    };
  }, [socket, hasStartedTyping]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      `isTyping:${conversationId}:${otherUserProfile.id}`,
      (data: any) => {
        setUsersTyping((prev) => {
          return {
            ...prev,
            [data.profile.id]: data.typing,
          };
        });
      }
    );

    return () => {
      socket.off("typing");
    };
  }, [socket]);
};
