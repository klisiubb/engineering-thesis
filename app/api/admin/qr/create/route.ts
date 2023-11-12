import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
import * as QR from 'qrcode';


export async function POST(req: Request) {
  const user = await currentUser()

  const { name } = await req.json()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  if (!name) {
    return new NextResponse("Name must be provided", { status: 400 })
  }

  

  try {
    const qrcode = await prisma.qrCode.create({
      data: { name },
    })

    const base64 = await QR.toDataURL(qrcode.id)

    await prisma.qrCode.update({
      where: { id: qrcode.id },
      data: { base64 },
    })

    return NextResponse.json(qrcode, { status: 201 })
  } catch (error) {
    console.log("[QRCODE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
