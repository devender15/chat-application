"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { BiNotification } from "react-icons/bi";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreeDots } from "react-loader-spinner";
import FriendsLoader from "./skeletons/friendsLoader";

import { useStateContext } from "@/contexts/state-context";

export default function Sidebar() {
  const { friendRequests, friendsList, usersTyping, fetchingFriends } =
    useStateContext();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const FIXED_MODES = ["chat", "video"];

  const mode = FIXED_MODES.includes(
    pathname?.split("/")[1] ? pathname?.split("/")[1] : ""
  )
    ? pathname?.split("/")[1]
    : "chat";

  const currentSelectedUserId = pathname?.split("/")[2];

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-full ${
        isCollapsed ? "w-[20px]" : "w-fit"
      } !transition-all duration-500 ease-out flex overflow-x-hidden`}
    >
      {isCollapsed ? (
        <div className="h-full flex justify-center items-center bg-[#f3f4f6] dark:bg-[#111827]">
          <button onClick={handleToggleCollapse}>
            <ChevronLeft
              className={`h-5 w-5 transform ${
                isCollapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
      ) : (
        <div className={`space-y-4 dark:border-r py-4 px-4`}>
          <div className="px-3 py-2 flex flex-col gap-y-2">
            <Link href="/add-friend">
              <Button
                size={isCollapsed ? "icon" : "default"}
                className={`${isCollapsed ? "w-fit py-2 px-4" : "w-full"}`}
              >
                <FaUserFriends
                  className={`${isCollapsed ? "h-7 w-7" : "h-4 w-4 mr-2"}`}
                />{" "}
                {!isCollapsed && "Add a new friend"}
              </Button>
            </Link>
            <Link href="/friend-requests">
              <Button
                size={isCollapsed ? "icon" : "default"}
                className={`${isCollapsed ? "w-fit py-2 px-4" : "w-full"}`}
              >
                <BiNotification
                  className={`${isCollapsed ? "h-7 w-7" : "h-4 w-4 mr-2"}`}
                />{" "}
                {!isCollapsed && "Friend Requests"}{" "}
                {friendRequests.length > 0 ? `(${friendRequests.length})` : ""}
              </Button>
            </Link>
          </div>
          <div className="px-3 py-2">
            <h2
              className={`mb-2 py-4 ${
                isCollapsed ? "text-sm" : "text-lg"
              } font-semibold tracking-tight`}
            >
              Friends ( {friendsList.length} )
            </h2>
            <div className="space-y-1">
              <ScrollArea className="h-[400px] w-full">
                {fetchingFriends ? (
                  <FriendsLoader />
                ) : friendsList.length === 0 ? (
                  <p>Awww... you don&apos;t have any friends :/</p>
                ) : (
                  friendsList.map((friendObj) => (
                    <Link href={`/${mode}/${friendObj.id}`} key={friendObj.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            className={`w-[250px] justify-start flex items-center gap-x-3 h-16 mb-3 ${
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
                            {!isCollapsed && (
                              <div className="flex flex-col items-start gap-y-1">
                                <span
                                  className={`${
                                    currentSelectedUserId === friendObj.id
                                      ? "font-bold"
                                      : ""
                                  } text-sm`}
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
                            )}
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
      )}

      <div className="h-full flex justify-center items-center border-r dark:border-r-0 dark:bg-[#111827]">
        <button onClick={handleToggleCollapse}>
          <ChevronLeft
            className={`h-5 w-5 transform ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
