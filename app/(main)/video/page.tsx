import { Video } from "lucide-react";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
      <div className="flex flex-col items-center">
        <Video size={100} className="animate-pulse" />
        <h1 className="text-3xl font-semibold">Start Video Chat</h1>
      </div>
      <div>
        <p className="text-gray-500">
          Select a friend from left side and start video conversation with your
          friend right now!
        </p>
      </div>
    </div>
  );
}
