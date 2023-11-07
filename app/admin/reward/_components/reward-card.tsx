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
import { Reward } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const RewardCard = (reward: Reward) => {
  const router = useRouter();
  const onClick = async () => {
    try {
      const response = await axios.delete(
        `/api/admin/reward/delete/${reward.id}`
      );
      if (response.status === 200) {
        toast.success("Reward deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete reward");
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast.error("An error occurred while deleting reward");
    }
  };

  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{reward.name}</CardTitle>
          <hr className="mb-2" />
          <CardDescription>{reward.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              Quantity: <i>{reward.quantity}</i>
            </p>
            {reward.isPublished ? (
              <p className="text-green-700 font-semibold">Published</p>
            ) : (
              <p className="text-red-700 font-semibold">Unpublished</p>
            )}
          </div>
        </CardContent>
        <hr className="mb-2" />
        <CardFooter className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href={`/admin/reward/edit/${reward.id}`}>Edit</Link>
          </Button>
          <Button onClick={onClick} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default RewardCard;
