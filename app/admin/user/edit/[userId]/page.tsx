import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FirstNameForm } from "../../_components/first-name-form";
import { LastNameForm } from "../../_components/last-name-form";
import { RoleForm } from "../../_components/update-role-form";
import { Role } from "@prisma/client";
import { LectureForm } from "../../_components/lecture-form";
import { WorkshopForm } from "../../_components/workshop-form";
const UserEditPage = async ({ params }: { params: { userId: string } }) => {
  const user = await prisma.user.findUnique({
    where: {
      Id: params.userId,
    },
  });

  if (!user) {
    return redirect("/admin/user/");
  }

  const workshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
    },
  });

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Button asChild variant="outline">
            <Link href="/admin/user/">Go back!</Link>
          </Button>
          <h1 className="text-2xl font-medium">Edit user:</h1>
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
        suppressHydrationWarning
      >
        <FirstNameForm
          firstName={user.firstName ? user.firstName : ""}
          userId={user.Id}
        />
        <LastNameForm
          lastName={user.lastName ? user.lastName : ""}
          userId={user.Id}
        />
        <RoleForm role={user.role} userId={user.Id} />

        {user.role === Role.LECTURER && (
          <LectureForm
            workshopToLectureId={
              user.workshopToLectureId ? user.workshopToLectureId : ""
            }
            userId={user.Id}
            workshops={workshops}
          />
        )}

        {user.role === Role.USER && (
          <WorkshopForm
            workshopToAttendId={
              user.workshopToAttendId ? user.workshopToAttendId : ""
            }
            userId={user.Id}
            workshops={workshops}
          />
        )}
      </div>
    </div>
  );
};

export default UserEditPage;
