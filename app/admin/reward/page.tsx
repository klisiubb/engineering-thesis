import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RewardCard from "./_components/reward-card";
import { prisma } from "@/lib/db";

const RewardsPage = async () => {
  const rewards = await prisma.reward.findMany();
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Nagrody:</h1>
        <div className="mb-4 space-x-2">
          <Button asChild size="sm" variant="default">
            <Link href="/admin/reward/create">Utwórz nową nagrodę</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id}>
              <RewardCard {...reward} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
