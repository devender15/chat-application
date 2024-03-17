"use client";

import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import axios from "axios";
import { Profile } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

interface CreateGroupFormProps {
  selectedFriends: Profile[];
}

export default function CreateGroupForm({
  selectedFriends,
}: CreateGroupFormProps) {
  const { setCreateGroupModal, setGroupsList } = useStateContext();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/socket/group",
      });

      const response = await axios.post(url, {
        name: value.name,
        description: value.description,
        members: selectedFriends,
      });

      toast({
        variant: "default",
        description: response.data.message,
      });

      setGroupsList((prev) => [...prev, response.data.group]);

      setCreateGroupModal(false);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        description: "Something went wrong!"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Group Name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Group Description"
                    className="max-h-20"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Button
        variant="default"
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        className="w-full flex items-center gap-x-2"
        disabled={
          form.formState.isSubmitting ||
          !form.formState.isValid ||
          selectedFriends.length === 0
        }
      >
        {form.formState.isSubmitting ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          "Create"
        )}
      </Button>
    </div>
  );
}
