import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { currentUser } from "@clerk/nextjs"

export async function PATCH(
  req: Request,
  { params }: { params: { rewardId: string } }
) {
  const user = await currentUser()
  const { rewardId } = params
  const values = await req.json()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  if (!values) {
    return new NextResponse("Data must be provided", { status: 400 })
  }

  try {
    const reward = await prisma.reward.update({
      where: {
        id: rewardId,
      },
      data: {
        ...values,
      },
    })
    return NextResponse.json(reward, { status: 200 })
  } catch (error) {
    console.log("[REWARD_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
