import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db";
 const NewWorkshopCard = async ({ id }: { id: string }) => {
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
        return <div>Nie znaleziono wykładu...</div>;
    }
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
            <p className="mt-2 text-gray-500 text-justify">
              {workshop.description}
            </p>
          </div>
        </div>
      </Card>
    )
  }
  export default NewWorkshopCard;