"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
// @ts-ignore
import { triggerBase64Download } from "react-base64-downloader";
const QRCodeCard = (qrcode: QrCode) => {
  const router = useRouter();
  const onClick = async () => {
    try {
      const response = await axios.delete(`/api/admin/qr/delete/${qrcode.id}`);
      if (response.status === 200) {
        toast.success("Pomyślnie usunięto kod QR");
        router.refresh();
      } else {
        toast.error("Wystąpił błąd podczas usuwania kodu QR");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas usuwania kodu QR");
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
              Wartość: {qrcode.value === null ? "Nie ustawionio" : qrcode.value}
            </p>
            <p className="text-gray-700">
              Maksymalna liczba użyć:{" "}
              <span>
                {qrcode.maxUses === 0 ? "Nie dotyczy" : qrcode.maxUses}
              </span>
            </p>
            <p className="text-gray-700">
              Status:{" "}
              {qrcode.isPublished ? (
                <span className="text-green-700 font-semibold">Opublikowany</span>
              ) : (
                <span className="text-red-700 font-semibold">Widoczny tylko dla administratorów</span>
              )}
            </p>
            <p className="text-gray-700">
              Typ:{" "}
              {qrcode.workshopId === null ? (
                <span>Ogólny</span>
              ) : (
                <span>Wydarzenie</span>
              )}
            </p>
            {qrcode.isPublished ? (
              <Button
                variant="secondary"
                onClick={() =>
                  triggerBase64Download(qrcode.base64, qrcode.name)
                }
              >
               Pobierz kod QR
              </Button>
            ) : (
              <Button variant="secondary">Opublikuj kod, by pobrać</Button>
            )}
          </div>
        </CardContent>
        <hr className="mb-2" />
        <CardFooter className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href={`/admin/qr/edit/${qrcode.id}`}>Edytuj</Link>
          </Button>
          <Button onClick={onClick} variant="destructive">
            Usuń
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default QRCodeCard;
