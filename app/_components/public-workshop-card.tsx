import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Calendar, CalendarCheck, MapPin } from "lucide-react";

const PublicWorkshopCard = async ({ id }: { id: string }) => {
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
        <CardDescription>Public workshop</CardDescription>
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
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PublicWorkshopCard;
