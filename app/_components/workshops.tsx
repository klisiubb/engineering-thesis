import { prisma } from "@/lib/db";
import WorkshopCard from "./workshop-card";
import PublicWorkshopCard from "./public-workshop-card";

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
      <h1 className="text-4xl font-bold mb-4"> Public workshops:</h1>
      <p>Everybody can take part in this workshops...</p>
      {publicWorkshops.length === 0 ? (
        <div className="text-center mt-2">
          <p>
            No public workshops available at the moment. Please come back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
          {publicWorkshops.map((workshop) => (
            <PublicWorkshopCard key={workshop.id} id={workshop.id} />
          ))}
        </div>
      )}

      <hr className="my-6" />
      <h1 className="text-4xl font-bold mb-4"> Private workshops:</h1>
      <p>Sign up for private workshops if there is space...</p>
      {privateWorkshops.length === 0 ? (
        <div className="text-center mt-2">
          <p>
            No private workshops available at the moment. Please come back
            later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
          {privateWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} id={workshop.id} />
          ))}
        </div>
      )}
      <hr className="my-6" />
    </div>
  );
};

export default WorkshopsComponent;
