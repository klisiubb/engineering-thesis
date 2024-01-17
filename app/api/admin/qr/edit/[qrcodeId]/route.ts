import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { qrcodeId: string } }
) {
  const user = await currentUser();
  const { qrcodeId } = params;
  const values = await req.json();

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!values) {
    return new NextResponse("Data must be provided", { status: 400 });
  }

  if (values.workshopId) {
    await prisma.qrCode.update({
      where: {
        id: qrcodeId,
      },
      data: {
        workshopId: null,
      },
    });
  }

  try {
    const qrCode = await prisma.qrCode.update({
      where: {
        id: qrcodeId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(qrCode, { status: 200 });
  } catch (error) {
    console.log("[QRCode_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
