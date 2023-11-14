
import { prisma } from "@/lib/db"
import { clerkClient, currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE( req: Request,
  { params }: { params: { userId: string } }
){
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      Id: params.userId,
    },
    include:{
      workshopToAttend: true,
      WorkshopToLecture: true,
    }
  })


  try {
   let del = await clerkClient.users.deleteUser(foundUser?.externalId as string)

   if(foundUser?.workshopToAttend){
      await prisma.workshop.update({
        where: {
          id: foundUser.workshopToAttend.id,
        },
        data: {
          attenders: {
            disconnect: {
              Id: foundUser.Id,
            },
          },
        },
      })
    }

    if(foundUser?.WorkshopToLecture){
      await prisma.workshop.update({
        where: {
          id: foundUser.WorkshopToLecture.id,
        },
        data: {
          lecturers: {
            disconnect: {
              Id: foundUser.Id,
            },
          },
        },
      })
    }

   await prisma.user.delete({
     where: {
        Id: params.userId,
     },
    })
  }
  catch (error) {
    return NextResponse.json({ status: 500 })
  }
  
  return NextResponse.json({status: 200 })
}
