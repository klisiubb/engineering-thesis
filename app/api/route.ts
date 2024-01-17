import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { clerkClient, currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  const user = await currentUser();
  const { userId, workshopId } = await req.json();

  if (!user || user.publicMetadata.role !== Role.USER) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!userId || !workshopId) {
    return new NextResponse("Data must be provided", { status: 400 });
  }

  try {
    const registeredUser = await prisma.user.update({
      where: { externalId: userId },
      data: {
        workshopToAttend: {
          connect: {
            id: workshopId,
          },
        },
      },
    });

    return NextResponse.json(registeredUser, { status: 200 });
  } catch (error) {
    console.log("[WORKSHOP_SIGN_UP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
