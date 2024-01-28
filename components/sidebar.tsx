"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { FaUserFriends } from "react-icons/fa";
import { BiNotification } from "react-icons/bi";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreeDots } from "react-loader-spinner";

import { useStateContext } from "@/contexts/state-context";

export default function Sidebar() {
  const { friendRequests, friendsList, usersTyping } = useStateContext();
  const pathname = usePathname();

  const FIXED_MODES = ["chat", "video"];

  const mode = FIXED_MODES.includes(
    pathname?.split("/")[1] ? pathname?.split("/")[1] : ""
  )
    ? pathname?.split("/")[1]
    : "chat";

  const currentSelectedUserId = pathname?.split("/")[2];

  return (
    <div className="border-r h-full w-full">
      <div className="space-y-4 p-4">
        <div className="px-3 py-2 flex flex-col gap-y-2">
          <Link href="/add-friend">
            <Button className="w-full">
              <FaUserFriends className="mr-2 h-4 w-4" /> Add a new friend
            </Button>
          </Link>
          <Link href="/friend-requests">
            <Button className="w-full">
              <BiNotification className="mr-2 h-4 w-4" /> Friend Requests{" "}
              {friendRequests.length > 0 ? `(${friendRequests.length})` : ""}
            </Button>
          </Link>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 py-4 text-lg font-semibold tracking-tight">
            Friends ( {friendsList.length} )
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[400px] w-full">
              {friendsList.length === 0 ? (
                <p>Awww... you don&apos;t have any friends :/</p>
              ) : (
                friendsList.map((friendObj) => (
                  <Link href={`/${mode}/${friendObj.id}`} key={friendObj.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          className={`w-full justify-start flex items-center gap-x-3 h-16 mb-3 ${
                            currentSelectedUserId === friendObj.id
                              ? "bg-primary/25"
                              : ""
                          }`}
                        >
                          <Avatar>
                            <AvatarImage
                              src={friendObj.imageUrl}
                              className="h-10 w-10"
                            />
                            <AvatarFallback>
                              {friendObj.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start gap-y-1">
                            <span
                              className={`${
                                currentSelectedUserId === friendObj.id
                                  ? "font-bold"
                                  : ""
                              } text-base`}
                            >
                              {friendObj.name.length > 16
                                ? friendObj.name.substring(0, 16)
                                : friendObj.name}
                            </span>

                            {usersTyping[friendObj.id] && (
                              <ThreeDots
                                height="20"
                                width="30"
                                radius="9"
                                color="gray"
                                ariaLabel="three-dots-loading"
                                visible={true}
                                wrapperStyle={{}}
                                wrapperClass=""
                              />
                            )}
                          </div>
                        </Button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>Remove friend</ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </Link>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
