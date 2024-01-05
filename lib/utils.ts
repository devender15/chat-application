import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import React from "react";
import { type FriendRequest } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleFetchFriendRequests = async (
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>
) => {
  const response = await axios.get("/api/friend-requests");
  setFriendRequests(response.data);
};

export const parseDateString = (dateString: string): string => {
  const parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  return parsedDate.toLocaleString(undefined, options);
};
