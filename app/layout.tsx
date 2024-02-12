import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketContextProvider } from "@/contexts/socket";
import { StateContextProvider } from "@/contexts/state-context";
import { Toaster } from "@/components/ui/toaster";
// import { dark, neobrutalism  } from "@clerk/themes";

import MessageFileModal from "@/components/modals/message-file.modal";

const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider
      // appearance={{
      //   baseTheme: neobrutalism,
      // }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <SocketContextProvider>
              <StateContextProvider>
                <MessageFileModal />
                {children}
              </StateContextProvider>
            </SocketContextProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
