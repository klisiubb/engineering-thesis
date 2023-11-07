"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { QrCode } from "@prisma/client";

interface PublishProps {
  initialData: QrCode;
  qrcodeId: string;
}

const SaveForm = ({ initialData, qrcodeId }: PublishProps) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      await axios.patch(`/api/admin/qr/edit/${qrcodeId}`, {
        isPublished: !initialData.isPublished,
      });
      toast.success("QR Codestatus updated");
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
