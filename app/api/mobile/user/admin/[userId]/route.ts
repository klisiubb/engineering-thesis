import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { corsHeaders } from "../../options";

export async function GET( req: Request, { params }: { params: { userId: string }} ){
  

  const { userId } = params

    const publicKey = process.env.PUBLIC_KEY as string;
  
    const token =  req.headers.get("Authorization")?.split(" ")[1] as string;
  
    if(!token){
      return NextResponse.json({message: "Unauthorized"}, { headers: corsHeaders ,status: 401});
    }
  
      let decoded = jwt.decode(token, { complete: true });  
    const decodedSub = decoded?.payload.sub as string;

//Scanner volunteer
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

  // User to scan and check if he is present
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
    if(userToScan.isPresentAtEvent === true && userToScan.isPresentAtWorkshop !== true){
        await prisma.user.update({
          where: {
            externalId: userId
          },
          data: {
              isPresentAtWorkshop: true,
              }
          }
      ) 
      return NextResponse.json({message: "User set as present at workshop!"}, { headers: corsHeaders, status:200 });
        }
    if(userToScan.isPresentAtEvent === true && userToScan.isPresentAtWorkshop === true){
        return NextResponse.json({message: "User is already present at event and workshop!"}, { headers: corsHeaders, status:400 });
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