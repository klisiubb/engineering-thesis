import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

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
    return NextResponse.json(qrcode, { status: 201 })
  } catch (error) {
    console.log("[QRCODE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
