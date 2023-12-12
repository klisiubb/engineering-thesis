import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  
  export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export async function POST( req: Request, { params }: { params: { userId: string }} ){
  
  console.log(params)

  const { userId } = params

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

//Scanner
const user = await prisma.user.findUnique({
  where: {
    externalId: decodedSub
  },
})
 

  if(!user || user.role  === Role.USER){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // User provided to scan
    const userToScan = await prisma.user.findUnique({
        where: {
        Id: userId
        },
    })

    if(!userToScan){
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    if(userToScan.role !== Role.USER){
        return NextResponse.json({error: "User is not user role"}, {status: 404});
    }
    if(userToScan.isPresentAtEvent === true){
        return NextResponse.json({error: "User is already present at event"}, {status: 404});
    }
    await prisma.user.update({
        where: {
            Id: userId
        },
        data: {
            isPresentAtEvent: true,
            }
        }
    ) 
    return NextResponse.json({success: "Set as present!"}, { headers: corsHeaders });
}