
import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE( req: Request,
  { params }: { params: { workshopId: string } }
){
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {

  const workshop = await prisma.workshop.findUnique({
    where: {
      id: params.workshopId,
    },
    include:{
      qrCode: true,
      attenders: true,
      lecturers: true,
    }
  })

  if (!workshop) {
    return new NextResponse("Not Found", { status: 404 })
  }

  if(workshop.qrCodeId !== null){
    console.log("KURWA " + workshop.qrCodeId)
   let deleted = await prisma.qrCode.delete({
      where: {
        id: workshop.qrCodeId,
      },
    })
    console.log(deleted)
  }
  if(workshop.attenders.length > 0){
    await prisma.user.updateMany({
      where: {
        Id: {
          in: workshop.attenders.map((attender) => attender.Id),
        },
      },
      data: {
        workshopToAttendId: {
          set: null,
        },

        },
      },
    )
  }

  if(workshop.lecturers.length > 0){
    await prisma.user.updateMany({
      where: {
        Id: {
          in: workshop.lecturers.map((lecturer) => lecturer.Id),
        },
      },
      data: {
        workshopToLectureId: {
          set: null,
        },

        },
      },
    )
  }


await prisma.workshop.delete({
      where: {
        id: params.workshopId,
      },
    })
  }
  catch (error) {
    return NextResponse.json({ status: 500 })
  }
  
  return NextResponse.json({status: 200 })
}
