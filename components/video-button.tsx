"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Button } from "./ui/button";

import { Video, VideoOff } from "lucide-react";

export default function VideoButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const handleToggleVideoCall = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggleVideoCall}>
      {isVideo ? <VideoOff size={24} /> : <Video size={24} />}
    </Button>
  );
}
