"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  topic: z.string().min(1, {
    message: "Name is required",
  }),
});

const CreatePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/admin/reward/create", values);
      router.push(`/admin/reward/edit/${response.data.id}`);
      toast.success("Reward created");
    } catch (error) {
      console.error(error);
      toast.error("Reward with this name already exists!");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="h-full grid place-items-center">
      <div className="max-w-5xl w-full mx-auto p-6">
        <h1 className="text-2xl">Reward name</h1>
        <p className="text-sm text-slate-600">
          What is the name of the reward? Don&apos;t worry, you can change this
          later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward name:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'PS5 + Cyberpunk 2077'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you give out?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2 items-center justify-center">
              <Link href="/admin/reward/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
