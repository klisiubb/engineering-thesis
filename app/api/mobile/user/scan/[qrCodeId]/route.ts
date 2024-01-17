import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../../options";

export async function GET(
  req: Request,
  { params }: { params: { qrCodeId: string } }
) {
  const { qrCodeId } = params;

  const publicKey = process.env.PUBLIC_KEY as string;

  const token = req.headers.get("Authorization")?.split(" ")[1] as string;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized token error" },
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

  const qrCode = await prisma.qrCode.findUnique({
    where: {
      id: qrCodeId,
    },
    include: {
      scannedBy: true,
      Workshop: true,
    },
  });
  if (!qrCode || qrCode.isPublished === false) {
    return NextResponse.json(
      { message: "QR code not found" },
      { headers: corsHeaders, status: 404 }
    );
  }

  //Check if user already scanned this qr code
  const alreadyScanned = qrCode.scannedBy.find(
    (scannedBy) => scannedBy.externalId === decodedSub
  );
  if (alreadyScanned) {
    return NextResponse.json(
      { message: " You already scanned this QR Code" },
      { headers: corsHeaders, status: 400 }
    );
  }
  //Check if qr limit is reached
  const scannedCount = qrCode.scannedBy.length;
  if (qrCode.maxUses > 0 && scannedCount >= qrCode.maxUses) {
    return NextResponse.json(
      { message: "QR Code was scanned too many times!" },
      { headers: corsHeaders, status: 400 }
    );
  }

  //TODO CHECK IF QR IS WORKSHOP ONLY AND IF USER IS IN THIS WORKSHOP
  if (
    qrCode.workshopId !== null &&
    qrCode.workshopId !== user?.workshopToAttendId
  ) {
    return NextResponse.json(
      { message: "You are not in this workshop" },
      { headers: corsHeaders, status: 400 }
    );
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
    { message: "Successfully scanned this QR Code!" },
    { headers: corsHeaders, status: 200 }
  );
}
