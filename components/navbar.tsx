"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

import { useToast } from "./ui/use-toast";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { StatusIndicator } from "./status-indicator";

export default function Navbar() {
  const { toast } = useToast();

  // ---- Functions
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        redirect("/login");
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to logout!.",
        });
        console.log("Error signing out: ", error);
      });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background h-16 px-10">
      <nav className="w-full h-full flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <h1 className="text-2xl font-semibold">Realtime Chat</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Options</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link href="/chat">
                        <Button
                          variant="secondary"
                          className="w-full justify-start"
                        >
                          Chat
                        </Button>
                      </Link>
                    </li>

                    <li>
                      <Link href="/video">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Video Call
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <StatusIndicator />
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="default" onClick={handleLogOut}>
            Log Out
          </Button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
