"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsLoader() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[64px] w-[250px] rounded-md" />
      <Skeleton className="h-[64px] w-[250px] rounded-md" />
      <Skeleton className="h-[64px] w-[250px] rounded-md" />
      <Skeleton className="h-[64px] w-[250px] rounded-md" />
    </div>
  );
}
