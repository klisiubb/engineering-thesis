"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Workshop } from "@prisma/client";

interface PublishProps {
  initialData: Workshop;
  workshopId: string;
}

const SaveForm = ({ initialData, workshopId }: PublishProps) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      await axios.patch(`/api/admin/workshop/edit/${workshopId}`, {
        isPublished: !initialData.isPublished,
      });
      toast.success("Workshop status updated");
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
