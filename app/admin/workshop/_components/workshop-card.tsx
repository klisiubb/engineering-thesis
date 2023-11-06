import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workshop } from "@prisma/client";
import Link from "next/link";
import React from "react";

const WorkshopCard = (workshop: Workshop) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{workshop.topic}</CardTitle>
          <CardDescription>{workshop.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Start date: {workshop.startDate.toLocaleString()}</p>
          <p>End date: {workshop.endDate.toLocaleString()}</p>
          <p>Room: {workshop.room}</p>
          <p>Max attenders: {workshop.maxAttenders}</p>
          <p>Current attenders: {workshop.currentAttenders}</p>
          <p>{workshop.isPublished ? `Published` : `Unpublished`}</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href={`/admin/workshop/edit/${workshop.id}`}>Edit</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link href={`/admin/workshop/delete/${workshop.id}`}>Delete</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default WorkshopCard;
