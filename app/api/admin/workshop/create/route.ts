import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  const { topic } = await req.json();

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!topic) {
    return new NextResponse("Topic must be provided", { status: 400 });
  }

  try {
    const workshop = await prisma.workshop.create({
      data: { topic },
    });
    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.log("[WORKSHOP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
