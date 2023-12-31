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
        toast.success("Workshop deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete workshop");
      }
    } catch (error) {
      console.error("Error deleting workshop:", error);
      toast.error("An error occurred while deleting workshop");
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
              Start date: {new Date(workshop.startDate).toLocaleString()}
            </p>
            <p className="text-gray-700" suppressHydrationWarning>
              End date: {new Date(workshop.endDate).toLocaleString()}
            </p>
            <p className="text-gray-700">
              Room: {workshop.room ? workshop.room : "Not set"}
            </p>
            <p className="text-gray-700">
              Publicity:{" "}
              <span>
                {workshop.isPublic
                  ? "Public"
                  : "Private " + attenders + "/" + workshop.maxAttenders}
              </span>
            </p>
            {workshop.isPublished ? (
              <p className="text-green-700 font-semibold">Published</p>
            ) : (
              <p className="text-red-700 font-semibold">Unpublished</p>
            )}
            <p className=" text-sm italic text-gray-600">
              Dont forget to set lecturer(s) and generate QR Code for this
              workshop!
            </p>
          </div>
        </CardContent>
        <hr className="mb-2" />
        <CardFooter className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href={`/admin/workshop/edit/${workshop.id}`}>Edit</Link>
          </Button>
          <Button onClick={onClick} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default WorkshopCard;
