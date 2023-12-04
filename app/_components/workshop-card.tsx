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
import { Calendar, CalendarCheck, MapPin } from "lucide-react";
import RegisterFor from "./register-for";
import { Role } from "@prisma/client";
import Link from "next/link";

const WorkshopCard = async ({ id }: { id: string }) => {
  const { userId, user } = auth();

  const loggedUser = await prisma.user.findFirst({
    where: {
      externalId: userId ? userId : "",
    },
  });

  const isSignedForWorkshop = loggedUser?.workshopToAttendId !== null;

  const workshop = await prisma.workshop.findUnique({
    where: {
      id,
    },
    include: {
      attenders: true,
      lecturers: true,
    },
  });
  if (!workshop) {
    return <div>Workshop not found</div>;
  }
  const currentAttenders = workshop.attenders.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {workshop.topic} presented by
          <ul>
            {workshop.lecturers.map((lecturer) => (
              <li key={lecturer.Id}>
                {lecturer.firstName} {lecturer.lastName}
              </li>
            ))}
          </ul>
        </CardTitle>
        <CardDescription>
          Registered users: {currentAttenders}/{workshop.maxAttenders}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="mb-2">{workshop.description}</div>
          <div className="flex">
            <Calendar className="me-2" />
            Start:{" "}
            {workshop.startDate.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
          <div className="flex">
            <CalendarCheck className="me-2" />
            End:{" "}
            {workshop.endDate.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
          <div className="flex">
            <MapPin className="me-2" />
            Room: {workshop.room}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {currentAttenders === workshop.maxAttenders ? (
          <Button variant="destructive" disabled>
            Workshop is full
          </Button>
        ) : (
          <div>
            {loggedUser === undefined || loggedUser === null ? (
              <Button variant="outline" disabled asChild>
                <Link href="/sign-in">Sign in to register</Link>
              </Button>
            ) : isSignedForWorkshop || loggedUser.role !== Role.USER ? (
              <Button variant="destructive" disabled>
                Already signed in
              </Button>
            ) : (
              <RegisterFor workshopId={workshop.id} userId={userId as string} />
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkshopCard;
