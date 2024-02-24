import { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { Toggle } from "@/components/ui/toggle";
import { motion as m } from "framer-motion";
import ChatInput from "./forms/chat-input";

import {
  Video,
  VideoOff,
  MonitorUp,
  X,
  Mic,
  MicOff,
  Radio,
  MessageSquareIcon,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Profile } from "@prisma/client";

interface VideoControlProps {
  handleInitiateCall: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;
  handleLeaveRoom: () => void;
  handleStartScreenShare: () => void;
  handleStopScreenShare: () => void;
  cameraActive: boolean;
  micActive: boolean;
  isScreenSharing: boolean;
  converstaionId: string;
  currentMember: Profile;
  otherMember: Profile;
}

export default function VideoControls({
  handleInitiateCall,
  toggleCamera,
  toggleMic,
  handleLeaveRoom,
  cameraActive,
  micActive,
  handleStartScreenShare,
  handleStopScreenShare,
  isScreenSharing,
  converstaionId,
  currentMember,
  otherMember,
}: VideoControlProps) {
  const [isMouseMoving, setIsMouseMoving] = useState(true);

  useEffect(() => {
    let mouseMoveTimeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsMouseMoving(true);
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => setIsMouseMoving(false), 2000);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(mouseMoveTimeout);
    };
  }, []);

  return (
    <m.div
      layout
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: isMouseMoving ? 1 : 0, y: isMouseMoving ? 0 : 20 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="rounded-xl p-2 bg-neutral-500/80 dark:bg-gray-800/80 w-[80%] mx-auto h-16 absolute bottom-2"
    >
      <ul className="flex items-center justify-evenly h-full">
        <li>
          <Toggle asChild className="p-2">
            <Button size="icon" variant="ghost" onClick={toggleCamera}>
              {cameraActive ? <Video size={35} /> : <VideoOff size={35} />}
            </Button>
          </Toggle>
        </li>
        <li>
          <Toggle asChild className="p-2">
            <Button size="icon" variant="ghost" onClick={toggleMic}>
              {micActive ? <Mic size={35} /> : <MicOff size={35} />}
            </Button>
          </Toggle>
        </li>
        <li>
          <Button size="icon" variant="ghost" onClick={handleInitiateCall}>
            <Radio size={35} />
          </Button>
        </li>
        <li>
          <Toggle asChild className="p-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={
                isScreenSharing ? handleStopScreenShare : handleStartScreenShare
              }
            >
              <MonitorUp size={35} />
            </Button>
          </Toggle>
        </li>
        <li>
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="ghost">
                <MessageSquareIcon size={30} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Send a quick note!</DrawerTitle>
                <div className="w-[60%] mx-auto">
                  <ChatInput
                    apiUrl="/api/socket/chats"
                    type="note"
                    otherUser={otherMember}
                    query={{
                      conversationId: converstaionId,
                    }}
                    currentUser={currentMember}
                    conversationId={converstaionId}
                  />
                </div>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </li>
        <li>
          <Button
            size="icon"
            variant="ghost"
            className="bg-red-500 hover:bg-red-600 p-1"
            onClick={handleLeaveRoom}
          >
            <X size={25} />
          </Button>
        </li>
      </ul>
    </m.div>
  );
}
