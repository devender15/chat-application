"use client";

import { useAuthContext } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const [currentUser] = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser]);

  return <div>home</div>;
}
