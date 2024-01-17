import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { corsHeaders } from "../options";

export async function GET( req: Request){
  const publicKey = process.env.PUBLIC_KEY as string;
  
    const token =  req.headers.get("Authorization")?.split(" ")[1] as string;
  
    if(!token){
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
  
      let decoded = jwt.decode(token, { complete: true });
      const data = await prisma.user.findUnique({
        where: {
          externalId: decoded?.payload.sub as string,
        },
        include: {
            workshopToAttend: true,
        }
      });

    return NextResponse.json(data, { headers: corsHeaders });
}