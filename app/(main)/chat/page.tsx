import { MessageSquare } from "lucide-react";

import { redirect } from "next/navigation";

export default function Page() {

  // redirect to home page because this page isn't accessible 
  redirect("/");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
      <div className="flex flex-col items-center">
        <MessageSquare size={100} className="animate-pulse" />
        <h1 className="text-3xl font-semibold">Start Chatting</h1>
      </div>
      <div>
        <p className="text-gray-500">
          Select a friend from left side and start conversation with your friend
          right now!
        </p>
      </div>
    </div>
  );
}
