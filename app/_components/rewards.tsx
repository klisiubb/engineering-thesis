import { prisma } from "@/lib/db";
import NewRewardsCard from "./new-rewards-card";


const RewardsComponent = async () => {
  const rewards = await prisma.reward.findMany({
    where: {
      isPublished: true,
    },
    include: {
      winners: true,
    },
  });
  return (
      <>
          <section className="w-full py-6 md:py-12 lg:py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl  font-semibold uppercase tracking-wide text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Nagrody do wygrania:
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-gray-400">
              Zgarnij nagrody, które przygotowaliśmy dla uczestników naszych
              warsztatów!
            </p>
          </div>
        </div>
      </div>
    </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {rewards.map((reward) => (
            <NewRewardsCard key={reward.id} id={reward.id} />
          ))}
        </div>
      );
      </>
  );
};

export default RewardsComponent;
