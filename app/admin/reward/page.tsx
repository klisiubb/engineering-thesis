import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RewardsPage = async () => {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Rewards:</h1>
        <div className="mb-4">
          <Button asChild size="sm" variant="default">
            <Link href="/admin/reward/create">Add new reward</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
          Tu wszystkie nagrody card
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
