import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  
  export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export async function POST( req: Request, { params }: { params: { qrCodeId: string }} ){
  
  console.log(params)

  const { qrCodeId } = params

    const publicKey = `
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzZkhZ3JnWPgQK8P+n79h
    jlEOuTstNjgz+NpaLUp/x+zc+IPfpX8Ubx0IGjyafMNhy0apGY3UIsB8mjpbWEN/
    9zqXmPYnSMMkKpSfkF+aauDmOaU19G+aYcNJuxny8btFjJVgpHBpPbHQtWTz84GR
    MoTfcP0zf22GtFqyM9PvSJv8AfnI6Bj1WTcdU34mjV8u4eZdwIPFGVa4AEE+9uWY
    UT0icUlPpupybjNXozQe+4y78kLzNs6hjnEckriL1VKZOI/2/ieb66m7E8EUiwAK
    dwi2gAAkZ5odr6IPcO3oa9ubVMxneKtg/t05Ok4Ar2Mwy9HqsPeYYAWz3xcz86pe
    vwIDAQAB
    `;
  
    const token =  req.headers.get("Authorization")?.split(" ")[1] as string;
  
    if(!token){
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
  
      let decoded = jwt.decode(token, { complete: true });  
    const decodedSub = decoded?.payload.sub as string;

const user = await prisma.user.findUnique({
  where: {
    externalId: decodedSub
  },
  include: {
    workshopToAttend: true,
  }
})
 

  if(!user || user.role !== "USER"){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const qrCode = await prisma.qrCode.findUnique({
    where: {
      id: qrCodeId
    },
    include: {
      scannedBy: true,
      Workshop: true,
    }
  })
  if(!qrCode || qrCode.isPublished === false){
    return NextResponse.json({error: "QR code not found"}, {status: 404});
  }

  //Check if user already scanned this qr code
  const alreadyScanned = qrCode.scannedBy.find((scannedBy) => scannedBy.externalId === decodedSub)
  if(alreadyScanned){
    return NextResponse.json({error: "Already scanned"}, {status: 400});
  }
  //Check if qr limit is reached
   const scannedCount = qrCode.scannedBy.length;
   if(scannedCount >= qrCode.maxUses)
    {
      return NextResponse.json({error: "QR limit reached"}, {status: 400});
    }

    // if is workshop only check if user is registered to workshop
    if(qrCode.workshopId !== undefined || qrCode.workshopId!== null){
      
      if(qrCode.workshopId !== user.workshopToAttendId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
      }
      
      await prisma.qrCode.update({
        where: {
          id: qrCodeId
        },
        data: {
          scannedBy: {
            connect: {
              externalId: decodedSub
            }
          }
        }
      })

      await prisma.user.update({
        where: {
          externalId: decodedSub
        },
        data: {
        points: {
          increment: qrCode.value as number
        }
    }
      })

      return NextResponse.json({success: "Scanned"}, {status: 200});
    }
    await prisma.qrCode.update({
      where: {
        id: qrCodeId
      },
      data: {
        scannedBy: {
          connect: {
            externalId: decodedSub
          }
        }
      }
    })
    await prisma.user.update({
      where: {
        externalId: decodedSub
      },
      data: {
      points: {
        increment: qrCode.value as number
      }
  }
    })
    return NextResponse.json({success: "Scanned"}, { headers: corsHeaders });
}