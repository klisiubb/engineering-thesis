import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import { NextResponse,NextRequest } from "next/server"
import * as jwt from "jsonwebtoken";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  
  export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export async function GET( req: Request,
  { params }: { params: { rewardId: string } }
){

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

   let admin = await prisma.user.findUnique({
        where: {
            externalId: decodedSub
        }
    })

    if(!admin || admin.role !== Role.ADMIN){
        return NextResponse.json({message: "Unauthorized"}, { headers: corsHeaders ,status: 401});
    }


  const reward = await prisma.reward.findUnique({
    where: {
      id: params.rewardId,
      quantity: {
        gt: 0
      }
    },
    include: {
        winners: true
    },
  })
  if(!reward){
    return NextResponse.json({message: "Reward not found"}, { headers: corsHeaders, status: 404 })
  }

  //Get all users who are eligible for wining reward
  const usersEligible = await prisma.user.findMany({
    where: {
        role: Role.USER, //Only users can win
        isPresentAtEvent: true, //Only users who are present at event can win
        isWinner: false, //Only users who have not won before can win
        points: {
            gte: 0  //Only users who have points greater than 0 can win
            }
        },
    })
    if(!usersEligible){
        return NextResponse.json({message:"No users eligible for winning reward"}, {  headers: corsHeaders,status: 404 })
    }
    

    // Calculate total tickets
const totalTickets = usersEligible.reduce((sum, user) => sum + user.points, 0);

// Generate a random number within the range of total tickets
const randomTicket = Math.floor(Math.random() * totalTickets);

// Iterate through eligible users to find the winner
let currentTicket = 0;
let winner;

for (const user of usersEligible) {
  const userTicketRange = currentTicket + user.points;

  // Check if the random ticket falls within the current user's range
  if (randomTicket >= currentTicket && randomTicket < userTicketRange) {
    winner = user;
    break;
  }

  currentTicket = userTicketRange;
}

if (!winner) {
  return NextResponse.json({message:"Unable to select a winner"}, { headers: corsHeaders,status: 500 });
}

// Mark the selected user as the winner in the database
await prisma.user.update({
  where: { Id: winner.Id },
  data: { isWinner: true },
});
await prisma.reward.update({
    where: { id: reward.id },
    data: {
        quantity: {
            decrement: 1
        },
        winners: {
            connect: {
                Id: winner.Id
            }
        }
    }
    });

    let response =  winner.firstName + " " + winner.lastName;

// Return success response
return NextResponse.json({message: `Winner: ${winner.firstName} ${winner.lastName}.`},{ headers: corsHeaders, status: 200 });

}
