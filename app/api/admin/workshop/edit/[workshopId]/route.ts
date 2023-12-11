import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { currentUser } from "@clerk/nextjs"

export async function PATCH(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  const user = await currentUser()
  const { workshopId } = params
  const values = await req.json()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  if (!values) {
    return new NextResponse("Data must be provided", { status: 400 })
  }
  try {
    const workshop = await prisma.workshop.update({
      where: {
        id: workshopId,
      },
      data: {
        ...values,
      },
    })
    return NextResponse.json(workshop, { status: 200 })
  } catch (error) {
    console.log("[WORKSHOP_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
