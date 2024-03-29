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
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Workshop } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface lectureFormProps {
  workshopToLectureId?: string;
  workshops: Workshop[];
  userId: string;
}

const formSchema = z.object({
  workshopToLectureId: z.string(),
});

export const LectureForm = ({
  workshopToLectureId,
  userId,
  workshops,
}: lectureFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: workshopToLectureId ? { workshopToLectureId } : {},
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/user/edit/${userId}`, values);
      toast.success("Zaaktualizowano prowadzącego wydarzenie");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak. Spróbuj ponownie później.");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Prowadzenie:
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
            Wybierz wydarzenie do prowadzenia
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          {workshops.some(
            (workshop) => workshop.id === workshopToLectureId
          ) && (
            <>
              {workshops.find((workshop) => workshop.id === workshopToLectureId)
                ?.topic
                ? workshops.find(
                    (workshop) => workshop.id === workshopToLectureId
                  )?.topic
                : "Nie wybrano..."}
            </>
          )}
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
              name="workshopToLectureId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz wydarzenie..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workshops.map((workshop) => (
                          <SelectItem key={workshop.id} value={workshop.id}>
                            {workshop.topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
