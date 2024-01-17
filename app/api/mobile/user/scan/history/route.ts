import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../../options";

export async function GET(req: Request) {
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
      QrCode: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized user error" },
      { headers: corsHeaders, status: 401 }
    );
  }
  const scannedQRCodes = await prisma.qrCode.findMany({
    where: {
      scannedBy: {
        some: {
          externalId: decodedSub,
        },
      },
    },
    include: {
      Workshop: true,
      scannedBy: true,
    },
  });
  return NextResponse.json(
    { scannedQRCodes },
    { headers: corsHeaders, status: 200 }
  );
}
