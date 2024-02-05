import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../../options";
import { use } from "react";

export async function GET(
  req: Request,
  { params }: { params: { qrCodeId: string } }
) {
  const { qrCodeId } = params;

  const publicKey = process.env.PUBLIC_KEY as string;

  const token = req.headers.get("Authorization")?.split(" ")[1] as string;

  if (!token) {
    return NextResponse.json(
      { message: "Brak dostępu" },
      { headers: corsHeaders, status: 401 }
    );
  }

  let decoded = jwt.decode(token, { complete: true });

  const decodedSub = decoded?.payload.sub as string;

  const user = await prisma.user.findUnique({
    where: {
      externalId: decodedSub,
    },
    include: {
      workshopToAttend: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Brak dostępu" },
      { headers: corsHeaders, status: 404 }
    );
  }

  const qrCode = await prisma.qrCode.findUnique({
    where: {
      id: qrCodeId,
    },
    include: {
      scannedBy: true,
      Workshop: true,
    },
  });
  //Check if qr code exists or is published
  if (!qrCode || qrCode.isPublished === false) {
    return NextResponse.json(
      { message: "Ten kod QR nie jest poprawny" },
      { headers: corsHeaders, status: 404 }
    );
  }

  if (user.isPresentAtEvent === false) {
    return NextResponse.json(
      { message: "Nie jesteś obecny na wydarzeniu" },
      { headers: corsHeaders, status: 404 }
    );
  }

  //Check if user already scanned this qr code
  const alreadyScanned = qrCode.scannedBy.find(
    (scannedBy) => scannedBy.externalId === decodedSub
  );
  if (alreadyScanned) {
    return NextResponse.json(
      { message: " Zeskanowałeś już ten kod QR" },
      { headers: corsHeaders, status: 400 }
    );
  }
  //Check if qr limit is reached
  const scannedCount = qrCode.scannedBy.length;
  if (qrCode.maxUses > 0 && scannedCount >= qrCode.maxUses) {
    return NextResponse.json(
      { message: "Ten kod QR został zeskanowany za dużo razy" },
      { headers: corsHeaders, status: 400 }
    );
  }

  //Can't scan other workshops qr codes if user is already in a different workshop
  if (
    qrCode.workshopId !== null &&
    qrCode.workshopId !== user?.workshopToAttendId
  ) {
    return NextResponse.json(
      { message: "Ten kod nie jest dla Twojego warsztatu" },
      { headers: corsHeaders, status: 400 }
    );
  }
  //Cant scan qr code for workshop if user is not present at workshop
  if (qrCode.workshopId === user?.workshopToAttendId && user?.isPresentAtWorkshop === false) {
    return NextResponse.json(
      { message: "Nie jesteś obecny na warsztacie" },
      { headers: corsHeaders, status: 400 }
    );
  }

  const currentTime = new Date();
  //Can't scan other qr codes if user is at workshop during workshop time
  if (user.workshopToAttendId !== null && user.workshopToAttend !== null) {
    if (
      currentTime >= new Date(user.workshopToAttend.startDate) &&
      currentTime <= new Date(user.workshopToAttend.endDate) && qrCode.workshopId !== user.workshopToAttendId
    ) {
      return NextResponse.json(
        { message: "Nie możesz skanować innych kodów gdy jesteś na warsztacie" },
        { headers: corsHeaders, status: 400 }
      );
    }
  }
  //Can't scan qr code for workshop if workshop is before workshop start date or after workshop end date
  if (qrCode.Workshop !== null) {
    if (currentTime <= new Date(qrCode.Workshop.startDate)) {
      return NextResponse.json(
        { message: "Ten kod jest jeszcze dostępny. Poczekaj na rozpoczęcie warsztatu" },
        { headers: corsHeaders, status: 400 }
      );
    }
    if (currentTime >= new Date(qrCode.Workshop.endDate)) {
      return NextResponse.json(
        { message: "Za późno. Ten kod nie jest dostępny" },
        { headers: corsHeaders, status: 400 }
      );
    }
  }

  await prisma.qrCode.update({
    where: {
      id: qrCodeId,
    },
    data: {
      scannedBy: {
        connect: {
          externalId: decodedSub,
        },
      },
    },
  });
  await prisma.user.update({
    where: {
      externalId: decodedSub,
    },
    data: {
      points: {
        increment: qrCode.value as number,
      },
    },
  });
  return NextResponse.json(
    { message: `Pomyślnie zeskanowano ten kod. Zdobywasz: ${qrCode.value} punktów` },
    { headers: corsHeaders, status: 200 }
  );
}
