
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
  })


  try {
   let del = await clerkClient.users.deleteUser(foundUser?.externalId as string)
   console.log(del) 
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
