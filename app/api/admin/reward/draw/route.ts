
import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET( req: Request,
  { params }: { params: { rewardId: string } }
){
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
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
    return new NextResponse("Reward not found", { status: 404 })
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
        return new NextResponse("No users eligible for winning reward", { status: 404 })
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
  return new NextResponse("Unable to select a winner", { status: 500 });
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
return new NextResponse(response,{ status: 200 });

}
