"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

import CreateGroupForm from "../forms/create-group-form";
import { useStateContext } from "@/contexts/state-context";

import { Profile } from "@prisma/client";

export default function CreateGroup() {
  const [selectedFriends, setSelectedFriends] = useState<Profile[]>([]);

  const { friendsList, setCreateGroupModal, createGroupModal } =
    useStateContext();

  return (
    <Dialog
      open={createGroupModal}
      onOpenChange={() => setCreateGroupModal(false)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left font-semibold">
            Create New Group
          </DialogTitle>
        </DialogHeader>
        <CreateGroupForm selectedFriends={selectedFriends} />

        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Friends</h4>
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                className="text-base w-full flex justify-between items-center"
              >
                {friend.name}
                <span>
                  <Checkbox
                    name={friend.name}
                    onCheckedChange={(e) =>
                      e
                        ? setSelectedFriends([...selectedFriends, friend])
                        : setSelectedFriends(
                            selectedFriends.filter((f) => f.id !== friend.id)
                          )
                    }
                  />
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
