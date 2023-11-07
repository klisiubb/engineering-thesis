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
import { QrCode } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const QRCodeCard = (qrcode: QrCode) => {
  const router = useRouter();
  const onClick = async () => {
    try {
      const response = await axios.delete(`/api/admin/qr/delete/${qrcode.id}`);
      if (response.status === 200) {
        toast.success("QR Code deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete QR code");
      }
    } catch (error) {
      console.error("Error deleting qr code:", error);
      toast.error("An error occurred while deleting QR Code");
    }
  };

  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{qrcode.name}</CardTitle>
          <hr className="mb-2" />
          <CardDescription>Value: {qrcode.value}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              Uses:{" "}
              <i>
                {qrcode.currentUses} / {qrcode.maxUses}
              </i>
            </p>
            {qrcode.isPublished ? (
              <p className="text-green-700 font-semibold">Published</p>
            ) : (
              <p className="text-red-700 font-semibold">Unpublished</p>
            )}
          </div>
        </CardContent>
        <hr className="mb-2" />
        <CardFooter className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href={`/admin/qr/edit/${qrcode.id}`}>Edit</Link>
          </Button>
          <Button onClick={onClick} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default QRCodeCard;
