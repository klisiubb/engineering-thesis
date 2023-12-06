import { prisma } from "@/lib/db";
import WorkshopCard from "./workshop-card";

const WorkshopsComponent = async () => {
  const workshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
    },
  });

  if (!workshops || workshops.length === 0) {
    return (
      <div className="text-center mt-2">
        No workshops available at the moment. Please comeback later.
      </div>
    );
  }
  return (
    <div className="text-center mt-2">
      <h1 className="text-4xl font-bold mb-4">Workshops:</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
        {workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} id={workshop.id} />
        ))}
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default WorkshopsComponent;
