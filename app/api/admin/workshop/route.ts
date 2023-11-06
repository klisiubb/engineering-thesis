import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
    const workshops = await prisma.workshop.findMany()
    if(!workshops) return new NextResponse("Internal Error", { status: 500 })

    return NextResponse.json(workshops, { status: 200 })
}
