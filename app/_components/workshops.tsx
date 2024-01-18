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
    <>
    <section className="w-full py-6 md:py-12 lg:py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
          <h1 className="text-3xl  font-semibold uppercase tracking-wide text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Nasze wykłady:
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-gray-400">
            Nie przegap okazji, aby wziąć udział w tych wykładach, które na pewno rozwiną Twoje umiejętności!
            </p>
          </div>
        </div>
      </div>
    </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {publicWorkshops.map((workshop) => (
            <NewWorkshopCard key={workshop.id} id={workshop.id} />
          ))}
        </div>
        <section className="w-full py-6 md:py-12 lg:py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl  font-semibold uppercase tracking-wide text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Nasze warsztaty:
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-gray-400">
            Nie przegap okazji, aby wziąć udział w tych warsztatach, które na pewno rozwiną Twoje umiejętności!
            </p>
          </div>
        </div>
      </div>
    </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {privateWorkshops.map((workshop) => (
            <NewPrivateWorkshopComponent key={workshop.id} id={workshop.id} />
          ))}
          </div>
          </>
  );
};

export default WorkshopsComponent;
