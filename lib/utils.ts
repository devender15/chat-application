import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encryptFirebaseUserId(id: string) {
  return btoa(id);
}

export function decryptFirebaseUserId(id: string) {
  return atob(id);
}

export const handleFetchFriendRequests = async (
  setFriendRequests: React.Dispatch<React.SetStateAction<never[]>>
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
