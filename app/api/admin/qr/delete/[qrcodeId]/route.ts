
import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE( req: Request,
  { params }: { params: { qrcodeId: string } }
){
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.qrCode.delete({
      where: {
        id: params.qrcodeId,
      },
    })
  }
  catch (error) {
    return NextResponse.json({ status: 500 })
  }
  
  return NextResponse.json({status: 200 })
}
