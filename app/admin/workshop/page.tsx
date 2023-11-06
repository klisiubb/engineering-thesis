import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkshopCard from "./_components/workshop-card";
const WorkshopPage = async () => {
  const workshops = await prisma.workshop.findMany();

  const user = await currentUser();
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Workshops:</h1>
          <Button asChild size="sm" variant="default">
            <Link href="/admin/workshop/create">Create new workshop</Link>
          </Button>
          <div className=" flex flex-row">
            {workshops.map((workshop) => (
              <div className="mx-2" key={workshop.id}>
                <WorkshopCard {...workshop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopPage;
