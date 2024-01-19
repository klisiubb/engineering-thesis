import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../options";

export async function GET(req: Request) {
  const publicKey = process.env.PUBLIC_KEY as string;

  const token = req.headers.get("Authorization")?.split(" ")[1] as string;
  if (!token) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  let decoded = jwt.decode(token, { complete: true });

  const publicworkshops = await prisma.workshop.findMany({
    where: {
      isPublic: true,
    },
    include: {
      lecturers: true,
    },
  });

  const decodedSub = decoded?.payload.sub as string;

  const hisWorkshop = await prisma.workshop.findMany({
    include: {
      attenders: true,
      lecturers: true,
    },
    where: {
      attenders: {
        some: {
          externalId: decodedSub,
        },
      },
    },
  });
  const firstWorkshop = hisWorkshop[0];

  const combinedWorkshops = [...publicworkshops, ...hisWorkshop];

  return NextResponse.json(combinedWorkshops, { headers: corsHeaders });
}
