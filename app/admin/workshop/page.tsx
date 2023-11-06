import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const WorkshopPage = async () => {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }
  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Workshops:</h1>
          <Button asChild variant="outline">
            <Link href="/admin/workshop/create">Create new workshop</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopPage;
