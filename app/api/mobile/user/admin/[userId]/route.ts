import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { corsHeaders } from "../../options";

export async function GET( req: Request, { params }: { params: { userId: string }} ){
  

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
      return NextResponse.json({message: "Unauthorized"}, { headers: corsHeaders ,status: 401});
    }
  
      let decoded = jwt.decode(token, { complete: true });  
    const decodedSub = decoded?.payload.sub as string;

//Scanner
const user = await prisma.user.findUnique({
  where: {
    externalId: decodedSub
  },
})
 

  if(!user){
    return NextResponse.json({message: "Unauthorized"}, { headers: corsHeaders ,status: 401});
  }
  if (user.role !== Role.ADMIN && user.role !== Role.VOLUNTEER && user.role !== Role.LECTURER) {
    return NextResponse.json({ message: "Unauthorized role" }, { headers: corsHeaders, status: 401 });
}

  // User provided to scan
    const userToScan = await prisma.user.findUnique({
        where: {
        externalId: userId
        },
    })

    if(!userToScan){
        return NextResponse.json({message: "User not found"}, { headers: corsHeaders ,status: 404});
    }

    if(userToScan.role !== Role.USER){
        return NextResponse.json({message: "User is not user role!"}, { headers: corsHeaders ,status: 404});
    }
    if(userToScan.isPresentAtEvent === true){
        return NextResponse.json({message: "User is already present at event!"}, { headers: corsHeaders ,status: 404});
    }
    await prisma.user.update({
        where: {
          externalId: userId
        },
        data: {
            isPresentAtEvent: true,
            }
        }
    ) 
    return NextResponse.json({message: "User set as present!"}, { headers: corsHeaders, status:200 });
}