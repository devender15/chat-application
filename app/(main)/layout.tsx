import type { Metadata } from "next";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "socialhope | A chat app",
  description: "A chat app built with Next.js and Socket.io",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-between h-[calc(100vh-4rem)]">
        <div className="basis-[20%] h-full">
          <Sidebar />
        </div>
        <div className="basis-[80%] h-full bg-gray-100 dark:bg-gray-900 p-2">{children}</div>
      </main>
    </>
  );
}
