"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useStateContext } from "@/contexts/state-context";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";

import { SendHorizonal, Loader2 } from "lucide-react";

import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Please upload a file.",
  }),
});

export default function MessageFileModal() {
  const router = useRouter();

  const { fileMessageModal, setFileMessageModal } = useStateContext();

  const isModalOpen = fileMessageModal.apiUrl ? true : false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleCloseModal = () => {
    form.reset();
    setFileMessageModal({
      apiUrl: "",
      query: {},
    });
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: fileMessageModal.apiUrl as string,
        query: fileMessageModal.query as Record<string, any>,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      router.refresh();
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Upload File
          </DialogTitle>
          <DialogDescription>Send a file message.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-gray-900 rounded-md flex justify-center  px-6 py-4">
              <Button
                variant="ghost"
                disabled={isLoading}
                className="flex gap-x-3 items-center"
              >
                Send{" "}
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <SendHorizonal size={20} />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
