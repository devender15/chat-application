"use client";

import { DataTable } from "./data-table";
import { parseDateString } from "@/lib/utils";
import { Profile } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import qs from "query-string";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

import { useStateContext } from "@/contexts/state-context";

export default function ShowRequestsData() {
  const { friendRequests, setFriendRequests, setFriendsList, friendsList } =
    useStateContext();

  const { toast } = useToast();

  const columns: ColumnDef<Profile>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => (
        <div className="w-full flex items-center gap-x-2 justify-center">
          <Avatar>
            <AvatarFallback>
              {row.original.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase text-center">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {parseDateString(row.original.createdAt)}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleAcceptRequest(row.original)}
          >
            <Check className="h-4 w-4" color="green" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleRejectRequest(row.original)}
          >
            <X className="h-4 w-4" color="red" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAcceptRequest = async (userObj: Profile) => {
    try {
      const data = {
        acceptedRequest: userObj,
      };

      // update the friend requests list
      const updatedFriendRequests: Profile[] = friendRequests.filter(
        (request: Profile) => request.id !== userObj.id
      );
      setFriendRequests(updatedFriendRequests);

      // update the friends list
      const updatedFriendsList: Profile[] = [...friendsList, userObj];
      setFriendsList(updatedFriendsList);

      const url = qs.stringifyUrl({
        url: "/api/socket/friend-request",
        query: {
          type: "accept",
        },
      });

      const response = await axios.post(url, data);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
  };

  const handleRejectRequest = async (userObj: Profile) => {
    const data = {
      rejectedRequest: userObj,
    };

    // update the friend requests list
    const updatedFriendRequests: Profile[] = friendRequests.filter(
      (request: Profile) => request.id !== userObj.id
    );
    setFriendRequests(updatedFriendRequests);

    const url = qs.stringifyUrl({
      url: "/api/socket/friend-request",
      query: {
        type: "reject",
      },
    });

    const response = await axios.post(url, data);

    if (response.status === 200) {
      toast({
        variant: "default",
        title: "Friend Request Declined",
        description: `You have rejected ${userObj.email} friend request!`,
      });
    }
  };

  return (
    <div className="w-full">
      <DataTable type="receive" columns={columns} data={friendRequests} />
    </div>
  );
}
