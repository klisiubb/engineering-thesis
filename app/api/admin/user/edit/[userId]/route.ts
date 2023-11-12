import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { clerkClient, currentUser } from "@clerk/nextjs"

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const user = await currentUser()
  const { userId } = params
  const values = await req.json()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  if (!values) {
    return new NextResponse("Data must be provided", { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        Id: userId
      },
      data: {
        ...values,
      },
    })

    if(values.role) {
      let role = values.role
      await clerkClient.users.updateUserMetadata(updatedUser.externalId, {
        publicMetadata: {
          role
        }
      })
        await prisma.user.update({
          where: {
            Id: userId
          },
          data: {
            workshopToAttendId: null,
            workshopToLectureId: null
          }
        })
    }

    return NextResponse.json(updatedUser, { status: 200 })

  } catch (error) {
    console.log("[USER_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
