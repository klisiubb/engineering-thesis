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
  return (
    <div className="text-center mt-2">
      <h1 className="text-4xl font-bold mb-4">Rewards:</h1>
      <p className="mb-2">Look what you can win!</p>
      {rewards.length === 0 ? (
        <div className="text-center mt-2">
          <p>No rewards available at the moment. Please come back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} id={reward.id} />
          ))}
        </div>
      )}
      <hr className="my-6" />
    </div>
  );
};

export default RewardsComponent;
