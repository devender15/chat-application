"use client";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Emoji from "../emoji";
import { Profile } from "@prisma/client";
import { useEmitTyping } from "@/hooks/use-emit-typing";
import { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/state-context";

import axios from "axios";
import qs from "query-string";

import { X } from "lucide-react";

import { useSocket } from "@/contexts/socket";

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  otherUser: Profile;
  type: "conversation" | "note";
  currentUser: Profile;
  conversationId: string;
}

export default function ChatInput({
  apiUrl,
  query,
  otherUser,
  type,
  currentUser,
  conversationId,
}: ChatInputProps) {
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const {
    editableChat,
    setEditableChat,
    setFileMessageModal,
    setMessagesSeen,
    setDirectMessages,
  } = useStateContext();

  const { socket } = useSocket();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEmitTyping({
    conversationId,
    currentProfile: currentUser,
    otherUserProfile: otherUser,
    hasStartedTyping,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const { content } = value;

    if (type === "conversation") {
      const fileUrl = "";

      try {
        if (editableChat.id) {
          const url = qs.stringifyUrl({
            url: `/api/socket/${editableChat.id}`,
            query: {
              chatId: editableChat.id,
              conversationId,
            },
          });

          await axios.patch(url, { content });

          handleResetEditableChat();
        } else {
          const url = qs.stringifyUrl({
            url: apiUrl,
            query,
          });

          const newMessage = {
            content,
            fileUrl,
            status: "COMPLETED",
            conversationId,
            senderId: currentUser.id,
            receiverId: otherUser.id,
            createdAt: new Date().toISOString(),
          };

          // @ts-ignore
          setDirectMessages((prev) => {
            const prevMessagesOfAParticularConversation =
              prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: [
                ...prevMessagesOfAParticularConversation,
                newMessage,
              ],
            };
          });

          form.reset();

          await axios.post(url, { content, fileUrl });
        }

        setHasStartedTyping(false);
        setMessagesSeen((prev) => {
          return {
            ...prev,
            [otherUser.id]: false,
          };
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      if (socket) {
        socket.emit(`send-note`, {
          content,
          sender: currentUser,
          receiver: otherUser,
          roomId: conversationId,
        });

        form.reset();
      }
    }
  };

  const handleResetEditableChat = () => {
    setEditableChat({ id: "", content: "" });
    form.reset();
  };

  useEffect(() => {
    if (editableChat.id) {
      form.setValue("content", editableChat.content);
    }
  }, [editableChat]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    {type === "conversation" && (
                      <button
                        type="button"
                        onClick={() =>
                          setFileMessageModal({
                            apiUrl,
                            query,
                          })
                        }
                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                      >
                        <Plus className="text-white dark:text-[#313338]" />
                      </button>
                    )}

                    <Input
                      className="px-14 py-6 bg-gray-100/90 shadow-md dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${otherUser.name}...`}
                      onChangeCapture={() => setHasStartedTyping(true)}
                      onBlur={() => {
                        setHasStartedTyping(false);
                      }}
                      onChange={field.onChange}
                      value={field.value}
                      name={field.name}
                    />

                    <div
                      className={`absolute top-7 ${
                        type === "conversation" ? "right-8" : "left-8"
                      }`}
                    >
                      <Emoji
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Popover open={editableChat.id ? true : false}>
        <PopoverTrigger></PopoverTrigger>
        <PopoverContent
          className="flex items-center gap-x-3 dark:bg-neutral-500 mb-[6rem] w-fit"
          align="start"
        >
          <p className="font-bold italic">
            {editableChat.id && editableChat.content}
          </p>
          <Button size="icon" variant="ghost">
            <X onClick={handleResetEditableChat} />
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
