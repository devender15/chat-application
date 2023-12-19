import Link from "next/link";

import { Button } from "./ui/button";
import { FaUserFriends } from "react-icons/fa";
import { BiNotification } from "react-icons/bi";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Sidebar() {
  return (
    <div className="border-r h-full w-full">
      <div className="space-y-4 p-4">
        <div className="px-3 py-2 space-y-1">
          <Button className="w-full">
            <FaUserFriends className="mr-2 h-4 w-4" /> Add a new friend
          </Button>
          <Button className="w-full">
            <BiNotification className="mr-2 h-4 w-4" /> Friend Requests ( 2 )
          </Button>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 py-4 text-lg font-semibold tracking-tight">
            Friends
          </h2>
          <div className="space-y-1">
            <Link href="/chat/1231231">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button variant="secondary" className="w-full justify-start">
                    Jay
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Remove friend</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Link>

            <Link href="/chat/1231231">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    Ronit
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Remove friend</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}