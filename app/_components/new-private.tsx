import { Card } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import RegisterFor from "./register-for";
 const NewPrivateWorkshopComponent = async ({ id }: { id: string }) => {
    const { userId } = auth();

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
      <Card className="max-w-md mx-auto  bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-16">
        <div className="flex flex-col md:flex-col">
          <div className="flex-shrink-0">
            <img
              alt="Workshop image"
              className="w-full object-cover h-48 md:h-48 md:w-full md:object-cover"
              height="300"
              src={workshop.imageURL}
              style={{
                aspectRatio: "500/300",
                objectFit: "cover",
              }}
              width="500"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-xl text-indigo-700 font-semibold">{workshop.topic}</div>
            <p className="mt-2 text-gray-500 text-justify h-36">
              {workshop.description}
            </p>
            <div className="mt-2 ">
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
                {loggedUser.role !== Role.USER
                  ? "Only users can register"
                  : "You are already signed!"}
              </Button>
            ) : (
              <RegisterFor workshopId={workshop.id} userId={userId as string} />
            )}
          </div>
        )}
            </div>
          </div>
        </div>
      </Card>
    )
  }
  export default NewPrivateWorkshopComponent;