import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../../options";

export async function GET( req:Request){

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
      return NextResponse.json({message: "Unauthorized token error"}, {headers:corsHeaders,status: 401});
    }
  
      let decoded = jwt.decode(token, { complete: true });  

    const decodedSub = decoded?.payload.sub as string;

const user = await prisma.user.findUnique({
  where: {
    externalId: decodedSub
  },
  include: {
   QrCode: true,
  }
})

if(!user){
  return NextResponse.json({message: "Unauthorized user error"}, {headers:corsHeaders,status: 401});
}
const scannedQRCodes = await prisma.qrCode.findMany({
  where: {
      scannedBy: {
          some: {
              externalId: decodedSub
          }
      }
  },
  include: {
      Workshop: true,
      scannedBy: true
  }
});
return NextResponse.json({ scannedQRCodes }, { headers: corsHeaders, status: 200 });
}