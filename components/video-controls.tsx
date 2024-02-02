import { Button } from "./ui/button";
import { Toggle } from "@/components/ui/toggle";

import { Video, VideoOff, MonitorUp, X, Mic, MicOff } from "lucide-react";

interface VideoControlProps {
  toggleCamera: () => void;
  handleLeaveRoom: () => void;
  cameraActive: boolean;
}

export default function VideoControls({
  toggleCamera,
  handleLeaveRoom,
  cameraActive,
}: VideoControlProps) {
  return (
    <div className="rounded-xl p-2 bg-neutral-500/80 dark:bg-gray-800/80 w-[80%] mx-auto h-16 absolute bottom-2">
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
            <Button size="icon" variant="ghost">
              <Mic size={35} />
            </Button>
          </Toggle>
        </li>
        <li>
          <Toggle asChild className="p-2">
            <Button size="icon" variant="ghost">
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
    </div>
  );
}
