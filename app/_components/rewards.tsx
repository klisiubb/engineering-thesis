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
    <div className="text-center mt-2">
      <h1 className="text-4xl font-bold mb-4">Rewards:</h1>
      <p className="mb-2">Look what you can win!</p>
      {rewards.length === 0 ? (
        <div className="text-center mt-2">
          <p>No rewards available at the moment. Please come back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto">
          {rewards.map((reward) => (
            <NewRewardsCard key={reward.id} id={reward.id} />
          ))}
        </div>
      )}
      <hr className="my-6" />
    </div>
  );
};

export default RewardsComponent;
