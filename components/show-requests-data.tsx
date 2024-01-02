"use client";

import { useStateContext } from "@/contexts/state-context";
import { DataTable } from "./data-table";
import { type FriendRequest } from "@/types";
import { parseDateString } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShowRequestsData() {
  const { friendRequests } = useStateContext();

  const columns: ColumnDef<FriendRequest>[] = [
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
              {row.original.sender.name.charAt(0)}
            </AvatarFallback>
            <AvatarImage
              src={row.original.sender.imageUrl}
              alt={row.original.sender.name}
            />
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.original.sender.name}</div>
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
        <div className="lowercase text-center">{row.original.sender.email}</div>
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
      cell: () => (
        <div className="flex items-center justify-center gap-x-2">
          <Button size="icon" variant="ghost">
            <Check className="h-4 w-4" color="green" />
          </Button>

          <Button size="icon" variant="ghost">
            <X className="h-4 w-4" color="red" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DataTable type="receive" columns={columns} data={friendRequests} />
    </div>
  );
}
