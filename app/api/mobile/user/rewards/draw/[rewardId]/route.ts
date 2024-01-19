import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { corsHeaders } from "../../../options";

export async function GET(
  req: Request,
  { params }: { params: { rewardId: string } }
) {
  const publicKey = process.env.PUBLIC_KEY as string;

  const token = req.headers.get("Authorization")?.split(" ")[1] as string;

  if (!token) {
    return NextResponse.json(
      { message: "Brak dostępu" },
      { headers: corsHeaders, status: 401 }
    );
  }

  let decoded = jwt.decode(token, { complete: true });
  const decodedSub = decoded?.payload.sub as string;

  let admin = await prisma.user.findUnique({
    where: {
      externalId: decodedSub,
    },
  });

  if (!admin || admin.role !== Role.ADMIN) {
    return NextResponse.json(
      { message: "Brak dostępu" },
      { headers: corsHeaders, status: 401 }
    );
  }

  const reward = await prisma.reward.findUnique({
    where: {
      id: params.rewardId,
      quantity: {
        gt: 0,
      },
    },
    include: {
      winners: true,
    },
  });
  if (!reward) {
    return NextResponse.json(
      { message: "Brak nagrody" },
      { headers: corsHeaders, status: 404 }
    );
  }

  //Get all users who are eligible for wining reward
  const usersEligible = await prisma.user.findMany({
    where: {
      role: Role.USER, //Only users can win
      isPresentAtEvent: true, //Only users who are present at event can win
      isWinner: false, //Only users who have not won before can win
      points: {
        gte: 0, //Only users who have points greater than 0 can win
      },
    },
  });

  //Remove users who assigned for a limited workshop and didn't attend
  usersEligible.filter((user) => user.workshopToAttendId !== null  && user.isPresentAtWorkshop === false);

  if (!usersEligible) {
    return NextResponse.json(
      { message: "Brak użytkowników spełniających warunki" },
      { headers: corsHeaders, status: 404 }
    );
  }

  // Calculate total tickets
  const totalTickets = usersEligible.reduce(
    (sum, user) => sum + user.points,
    0
  );

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
    return NextResponse.json(
      { message: "Brak użytkowników spełniających warunki" },
      { headers: corsHeaders, status: 500 }
    );
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
        decrement: 1,
      },
      winners: {
        connect: {
          Id: winner.Id,
        },
      },
    },
  });

  // Return success response
  return NextResponse.json(
    { message: `Zwyciężca: ${winner.firstName} ${winner.lastName}.` },
    { headers: corsHeaders, status: 200 }
  );
}
