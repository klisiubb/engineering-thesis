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
  name: z.string().min(1, {
    message: "Nazwa jest wymagana",
  }),
});

const CreatePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/admin/qr/create", values);
      router.push(`/admin/qr/edit/${response.data.id}`);
      toast.success("Utworzono kod QR");
    } catch (error) {
      console.error(error);
      toast.error("Taki kod QR już istnieje.");
    }
  };

  if (!isLoaded) {
    return <div>Ładowanie...</div>;
  }

  if (!isSignedIn || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="h-full grid place-items-center">
      <div className="max-w-5xl w-full mx-auto p-6">
        <h1 className="text-2xl">Kod QR</h1>
        <p className="text-sm text-slate-600">
          Jak nazwiesz ten kod QR? Nazwę będziesz mógł zmienić później.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa kodu:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="np.. 'Kod QR dla warsztatu React'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Jak nazwiesz swój kod QR?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2 items-center justify-center">
              <Link href="/admin/qr/">
                <Button type="button" variant="ghost">
                  Anuluj
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Dalej
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
