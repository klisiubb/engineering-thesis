import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Trophy } from "lucide-react";

const RewardCard = async ({ id }: { id: string }) => {
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
           {/*
        <div className="space-y-2">
          <div className="flex">
            <ul className="list-disc list-inside">
              {reward.winners.map((winner) => (
                <div key={winner.firstName} className="flex mx-2">
                  <Trophy />
                  <li>{winner.lastName}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
};

export default RewardCard;
