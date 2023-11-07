"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Reward } from "@prisma/client";

interface PublishProps {
  initialData: Reward;
  rewardId: string;
}

const SaveForm = ({ initialData, rewardId }: PublishProps) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      await axios.patch(`/api/admin/reward/edit/${rewardId}`, {
        isPublished: !initialData.isPublished,
      });
      toast.success("Reward status updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <Button
      onClick={onClick}
      variant={initialData.isPublished ? "destructive" : "default"}
    >
      {initialData.isPublished ? "Unpublish to edit" : "Publish"}
    </Button>
  );
};

export default SaveForm;
