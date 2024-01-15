import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";
import WorkshopCard from "./_components/workshop-card";

const WorkshopPage = async () => {
  const workshops = await prisma.workshop.findMany({
    include: {
      lecturers: true,
      attenders: true,
    },
  });

  const user = await currentUser();
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Workshops:</h1>
        <div className="mb-4">
          <Button asChild size="sm" variant="default">
            <Link href="/admin/workshop/create">Create new workshop</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
          {workshops.map((workshop) => (
            <div key={workshop.id}>
              <WorkshopCard
                workshop={workshop}
                attenders={workshop.attenders.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkshopPage;
