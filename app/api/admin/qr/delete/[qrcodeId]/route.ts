import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { qrcodeId: string } }
) {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const qrCode = await prisma.qrCode.findUnique({
      where: {
        id: params.qrcodeId,
      },
      include: {
        Workshop: true,
      },
    });

    if (!qrCode) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (qrCode.Workshop) {
      await prisma.workshop.update({
        where: {
          id: qrCode.Workshop.id,
        },
        data: {
          qrCodeId: null,
        },
      });
    }
    await prisma.qrCode.delete({
      where: {
        id: params.qrcodeId,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }

  return NextResponse.json({ status: 200 });
}
