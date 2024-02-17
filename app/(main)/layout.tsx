import type { Metadata } from "next";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "socialhope | A multi-featured interactive chat app",
  description: "Start interacting with your friends and family today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-between overflow-hidden h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex flex-1 h-full bg-gray-100 dark:bg-gray-900 p-2 !transition-all duration-500 ease-in">
          {children}
        </div>
      </main>
    </>
  );
}
