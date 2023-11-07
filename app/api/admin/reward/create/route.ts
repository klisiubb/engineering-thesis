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
    const reward = await prisma.reward.create({
      data: { name },
    })
    return NextResponse.json(reward, { status: 201 })
  } catch (error) {
    console.log("[REWARD]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
