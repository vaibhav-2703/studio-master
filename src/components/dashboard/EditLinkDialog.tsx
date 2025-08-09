
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LinkData } from "@/lib/types";
import { updateShortLink } from "@/lib/link-service";
import { useState } from "react";


interface EditLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  link: LinkData;
  onLinkUpdated: (link: LinkData) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty." }),
  originalUrl: z.string().url({ message: "Please enter a valid URL." }),
});


export function EditLinkDialog({ isOpen, onOpenChange, link, onLinkUpdated }: EditLinkDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: link.name || "",
      originalUrl: link.originalUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
        const updatedLink = await updateShortLink({
            id: link.id,
            name: values.name,
            originalUrl: values.originalUrl,
        });

        toast({
            title: "Success!",
            description: "Your link has been updated.",
        });
        onLinkUpdated(updatedLink);
        onOpenChange(false); // Close dialog on success

    } catch (error: unknown) {
      console.error("Error updating link:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the details for your short link. The alias cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="My Awesome Link" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="originalUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Destination URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/very/long/url" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
