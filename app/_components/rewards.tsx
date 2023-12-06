import { prisma } from "@/lib/db";
import RewardCard from "./rewards-card";

const RewardsComponent = async () => {
  const rewards = await prisma.reward.findMany({
    where: {
      isPublished: true,
    },
    include: {
      winners: true,
    },
  });

  if (!rewards || rewards.length === 0) {
    return (
      <div className="text-center mt-2">
        No rewards available at the moment. Please come back later.
      </div>
    );
  }
  return (
    <div className="text-center mt-2">
      <h1 className="text-4xl font-bold mb-4">Rewards:</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} id={reward.id} />
        ))}
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default RewardsComponent;
