"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workshop } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const WorkshopCard = ({
  workshop,
  attenders,
}: {
  workshop: Workshop;
  attenders: number;
}) => {
  const router = useRouter();
  const onClick = async () => {
    try {
      const response = await axios.delete(
        `/api/admin/workshop/delete/${workshop.id}`
      );
      if (response.status === 200) {
        toast.success("Pomyślnie usunięto warsztat");
        router.refresh();
      } else {
        toast.error("Wystąpił błąd podczas usuwania warsztatu");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas usuwania warsztatu");
    }
  };
  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{workshop.topic}</CardTitle>
          <hr className="mb-2" />
          <CardDescription>{workshop.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700" suppressHydrationWarning>
              Początek wydarzenia: {new Date(workshop.startDate).toLocaleString()}
            </p>
            <p className="text-gray-700" suppressHydrationWarning>
              Koniec wydarzenia: {new Date(workshop.endDate).toLocaleString()}
            </p>
            <p className="text-gray-700">
              Room: {workshop.room ? workshop.room : "Not set"}
            </p>
            <p className="text-gray-700">
              Typ:{" "}
              <span>
                {workshop.isPublic
                  ? "Wykład"
                  : "Warsztat " + attenders + "/" + workshop.maxAttenders}
              </span>
            </p>
            {workshop.isPublished ? (
              <p className="text-green-700 font-semibold">Opublikowany</p>
            ) : (
              <p className="text-red-700 font-semibold">Widoczny tylko dla administratorów</p>
            )}
            <p className=" text-sm italic text-gray-600">
             Nie zapomnij uzupełnić prowadzących i dodać kod QR!
            </p>
          </div>
        </CardContent>
        <hr className="mb-2" />
        <CardFooter className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href={`/admin/workshop/edit/${workshop.id}`}>Edytuj</Link>
          </Button>
          <Button onClick={onClick} variant="destructive">
            Usuń
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default WorkshopCard;
