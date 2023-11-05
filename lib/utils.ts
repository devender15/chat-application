import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptFirebaseUserId(id: string) {
  return btoa(id)
}

export function decryptFirebaseUserId(id: string) {
  return atob(id)
}