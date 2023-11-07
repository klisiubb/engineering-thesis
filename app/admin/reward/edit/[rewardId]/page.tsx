import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SaveForm from "../../_components/save-form";
import { DescriptionForm } from "../../_components/description-form";
import { QuantityForm } from "../../_components/quantity-form";
const RewardEditPage = async ({ params }: { params: { rewardId: string } }) => {
  const reward = await prisma.reward.findUnique({
    where: {
      id: params.rewardId,
    },
  });

  if (!reward) {
    return redirect("/admin/reward/");
  }

  const requiredFields = [reward.quantity, reward.description];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Button asChild variant="outline">
            <Link href="/admin/reward/">Go back!</Link>
          </Button>
          <h1 className="text-2xl font-medium">Reward setup:</h1>
          <span className="text-sm text-slate-700">
            {totalFields !== completedFields ? (
              `Please complete all fields ${completionText}!`
            ) : (
              <>
                Everything is set up <span className="text-green-900"> ✓ </span>
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
        suppressHydrationWarning
      >
        {reward.isPublished ? (
          <></>
        ) : (
          <>
            <DescriptionForm initialData={reward} rewardId={reward.id} />
            <QuantityForm initialData={reward} rewardId={reward.id} />
          </>
        )}
        {completedFields === totalFields && (
          <SaveForm initialData={reward} rewardId={reward.id} />
        )}
      </div>
    </div>
  );
};

export default RewardEditPage;
