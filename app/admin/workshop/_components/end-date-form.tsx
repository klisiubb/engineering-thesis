"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Workshop } from "@prisma/client";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "./datetime";
import { DateTime } from "luxon";

interface EndDateFormProps {
  initialData: Workshop;
  workshopId: string;
}

const EndDateForm = ({ initialData, workshopId }: EndDateFormProps) => {
  const formSchema = z
    .object({
      endDate: z.coerce.date(),
    })
    .refine((data) => {
      return data.endDate > initialData.startDate;
    }, "Data zakończenia musi być po dacie rozpoczęcia");
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDate: initialData.endDate,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/workshop/edit/${workshopId}`, values);
      toast.success("Zaaaktualizowano datę zakończenia");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Wystąpił błąd podczas aktualizacji daty zakończenia");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Data zakończenia
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Anuluj</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edytuj datę zakończenia
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          suppressHydrationWarning
          className={cn(
            "text-sm mt-2",
            !initialData.endDate && "text-slate-500 italic"
          )}
        >
          {initialData.endDate
            ? DateTime.fromJSDate(initialData.endDate).toLocaleString({
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Nie ustawiono..."}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      date={field.value || new Date()}
                      setDate={field.onChange}
                      selectedDate={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Zapisz
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
export default EndDateForm;
