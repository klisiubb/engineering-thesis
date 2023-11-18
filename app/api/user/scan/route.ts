import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
export async function POST(req: Request) {

    const qrCodeId = await req.json()

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
        return new NextResponse("Not Found", { status: 404 });
    }
  
      let decoded = jwt.decode(token, { complete: true });
       const userId = decoded?.payload.sub as string;

    const user = await prisma.user.findUnique({
        where: {
            externalId: userId,
        },
        });
    if (!user) {
        return new NextResponse("Not Found", { status: 404 });
    }
    if(user.role !== Role.USER){
        return new NextResponse("You are not a participant!", { status: 403 });
    }

    //Find QR Code by ID,

    const qrCode = await prisma.qrCode.findUnique({
        where: {
            id: qrCodeId,
        },
        include: {
            Workshop: true,
            scannedBy: true,
        },
    });

    if (!qrCode) {
        return new NextResponse("Not Found", { status: 404 });
    }
    if(qrCode.workshopId !== user.workshopToAttendId){
        return new NextResponse("You are not a participant of this workshop!", { status: 403 });
    }
    
    //Check if user already scanned this QR Code
    const alreadyScanned = qrCode.scannedBy.find((scannedBy) => scannedBy.Id === user.Id);
    if (alreadyScanned) {
        return new NextResponse("Already scanned this QR Code!", { status: 403 });
    }
    //Calculate all uses of this QR Code and check if is not more than max uses
    const scannedBy = qrCode.scannedBy.length + 1;
    if (scannedBy > qrCode.maxUses) {
        return new NextResponse("Max uses reached!", { status: 403 });
    }
    //Add user to scannedBy
    await prisma.qrCode.update({
        where: {
            id: qrCodeId,
        },
        data: {
            scannedBy: {
                connect: {
                    Id: user.Id,
                },
            },
        },
    });
    await prisma.user.update({
        where: {
            Id: user.Id,
        },
        data: {
            points: {
                increment: qrCode.value ?? 0,
            },
        },
    });
    return new NextResponse("Scanned!", { status: 200 });    


    
}
