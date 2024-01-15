import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SaveForm from "../../_components/save-form";
import { DescriptionForm } from "../../_components/description-form";
import { QuantityForm } from "../../_components/quantity-form";
import { NameForm } from "../../_components/name-form";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
const RewardEditPage = async ({ params }: { params: { rewardId: string } }) => {
  const user = await currentUser();
  const reward = await prisma.reward.findUnique({
    where: {
      id: params.rewardId,
    },
  });

  if (!reward) {
    return redirect("/admin/reward/");
  }

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  const requiredFields = [reward.quantity, reward.description, reward.name];

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
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4"
        suppressHydrationWarning
      >
        {reward.isPublished ? (
          <></>
        ) : (
          <>
            <NameForm initialData={reward} rewardId={reward.id} />
            <DescriptionForm initialData={reward} rewardId={reward.id} />
            <QuantityForm initialData={reward} rewardId={reward.id} />
          </>
        )}
      </div>
      <div className=" mt-2">
        {completedFields === totalFields && (
          <SaveForm initialData={reward} rewardId={reward.id} />
        )}
      </div>
    </div>
  );
};

export default RewardEditPage;
