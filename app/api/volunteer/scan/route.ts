import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
export async function POST(req: Request) {

    const scannedUserId = await req.json()

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
    if(user.role !== Role.VOLUNTEER){
        return new NextResponse("You are not a volunteer!", { status: 403 });
    }

    //Find User by ID,

    const scannedUser = await prisma.user.findUnique({
        where: {
            Id: scannedUserId,
        },
        include: {
            workshopToAttend: true,
        },
    });

    if (!scannedUser) {
        return new NextResponse("Not Found", { status: 404 });
    }



    if(scannedUser.isPresentAtEvent){
        return new NextResponse("User already scanned!", { status: 403 });
    }
    else {
        await prisma.user.update({
            where: {
                Id: scannedUserId,
            },
            data: {
                isPresentAtEvent: true,
            },
        });
    }
    return new NextResponse("Success", { status: 200 });
    
}
