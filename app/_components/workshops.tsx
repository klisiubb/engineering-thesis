import { prisma } from "@/lib/db";
import NewPrivateWorkshopComponent from "./new-private";
import NewWorkshopCard from "./new-workshop-card";

const WorkshopsComponent = async () => {
  const publicWorkshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
      isPublic: true,
    },
  });

  const privateWorkshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
      isPublic: false,
    },
  });
  return (
    <div className="text-center mt-2">
      <h1 className="text-4xl  mb-4 uppercase tracking-wide  text-neutral-800 font-semibold">Lectures:</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {publicWorkshops.map((workshop) => (
            <NewWorkshopCard key={workshop.id} id={workshop.id} />
          ))}
        </div>
        <h1 className="text-4xl  mb-4 uppercase tracking-wide  text-neutral-800 font-semibold">Workshops:</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {privateWorkshops.map((workshop) => (
            <NewPrivateWorkshopComponent key={workshop.id} id={workshop.id} />
          ))}
        </div>
    </div>
  );
};

export default WorkshopsComponent;
