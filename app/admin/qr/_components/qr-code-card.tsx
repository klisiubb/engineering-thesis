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
import Image from "next/image";
// @ts-ignore
import { triggerBase64Download } from "react-base64-downloader";
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
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              Value: {qrcode.value === null ? "Not set" : qrcode.value}
            </p>
            <p className="text-gray-700">
              Max uses:{" "}
              <span>
                {qrcode.maxUses === 0 ? "Not applicable" : qrcode.maxUses}
              </span>
            </p>
            <p className="text-gray-700">
              Status:{" "}
              {qrcode.isPublished ? (
                <span className="text-green-700 font-semibold">Published</span>
              ) : (
                <span className="text-red-700 font-semibold">Unpublished</span>
              )}
            </p>
            <p className="text-gray-700">
              Type:{" "}
              {qrcode.workshopId === null ? (
                <span>General</span>
              ) : (
                <span>Workshop only</span>
              )}
            </p>
            {qrcode.isPublished ? (
              <Button
                variant="secondary"
                onClick={() =>
                  triggerBase64Download(qrcode.base64, qrcode.name)
                }
              >
                Download QR Code
              </Button>
            ) : (
              <Button variant="secondary">Publish to download QR Code</Button>
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
