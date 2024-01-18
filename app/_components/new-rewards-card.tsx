import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
 const NewRewardComponent = async ({ id }: { id: string }) => {
    const reward = await prisma.reward.findUnique({
        where: {
          id,
        },
        include: {
          winners: true,
        },
      });
      if (!reward) {
        return <div>Reward not found</div>;
      }
    return (
      <Card className="max-w-md mx-auto  bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-16">
        <div className="flex flex-col md:flex-col">
          <div className="flex-shrink-0">
            <img
              alt="Reward image"
              className="w-full object-cover h-48 md:h-48 md:w-full md:object-cover"
              height="300"
              src={reward.imageURL}
              style={{
                aspectRatio: "500/300",
                objectFit: "cover",
              }}
              width="500"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-xl text-indigo-700 font-semibold">{reward.quantity}x | {reward.name}</div>
            <p className="mt-2 text-gray-500 text-justify">
              {reward.description}
            </p>
          </div>
        </div>
      </Card>
    )
  }
  export default NewRewardComponent;