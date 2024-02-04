import { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { Toggle } from "@/components/ui/toggle";
import { motion as m } from "framer-motion";

import { Video, VideoOff, MonitorUp, X, Mic, MicOff } from "lucide-react";

interface VideoControlProps {
  toggleCamera: () => void;
  toggleMic: () => void;
  handleLeaveRoom: () => void;
  handleStartScreenShare: () => void;
  handleStopScreenShare: () => void;
  cameraActive: boolean;
  micActive: boolean;
  isScreenSharing: boolean;
}

export default function VideoControls({
  toggleCamera,
  toggleMic,
  handleLeaveRoom,
  cameraActive,
  micActive,
  handleStartScreenShare,
  handleStopScreenShare,
  isScreenSharing,
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
