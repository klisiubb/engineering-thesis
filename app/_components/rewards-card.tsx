import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { auth, useUser } from "@clerk/nextjs";
import { Calendar, CalendarCheck, MapPin, Trophy } from "lucide-react";
import RegisterFor from "./register-for";
import { Role } from "@prisma/client";
import Link from "next/link";

const RewardCard = async ({ id }: { id: string }) => {
  const { userId, user } = auth();

  const reward = await prisma.reward.findUnique({
    where: {
      id,
    },
    include: {
      winners: true,
    },
  });
  if (!reward) {
    return <div>Reward not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{reward.quantity + "x" + reward.name}</CardTitle>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="mb-2">List of winners:</div>
          <div className="flex">
            <ul className="list-disc list-inside">
              {reward.winners.length === 0 && <li>No winners yet</li>}
              {reward.winners.map((winner) => (
                <div key={winner.firstName} className="flex mx-2">
                  <Trophy />
                  <li>{winner.lastName}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
