"use client";

import { Input } from "../ui/input";
import { Form, FormField } from "../ui/form";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";

import { useSocket } from "@/contexts/socket";


const formSchema = z.object({
  email: z.string().email(),
});

export default function SendFriendRequestForm() {
  const { toast } = useToast();

  const { socket } = useSocket();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    

    // send friend request
    socket.emit("sendFriendRequest", value.email);

    // show toast notification
    toast({
      title: "Friend Request Sent",
      description: `A friend request has been sent to ${value.email}`,
      action: (
        <ToastAction altText="Undo" onClick={() => {}}>
          Undo
        </ToastAction>
      ),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="Email"
              disabled={isLoading}
            />
          )}
        />
        <div className="flex mt-4 justify-end">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="flex items-center justify-center space-x-2"
          >
            <span>Send Friend Request</span>
            <Plus size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
