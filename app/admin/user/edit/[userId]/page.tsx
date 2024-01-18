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
import { currentUser, useUser } from "@clerk/nextjs";
const UserEditPage = async ({ params }: { params: { userId: string } }) => {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  const userToEdit = await prisma.user.findUnique({
    where: {
      Id: params.userId,
    },
  });

  if (!userToEdit) {
    return redirect("/admin/user/");
  }

  const workshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
    },
  });
  const workshopsPrivate = workshops.filter((workshop) => workshop.isPublic === false);

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Button asChild variant="outline">
            <Link href="/admin/user/">Wróć!</Link>
          </Button>
          <h1 className="text-2xl font-medium">Edytuj użytkownika:</h1>
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4"
        suppressHydrationWarning
      >
        <FirstNameForm
          firstName={userToEdit.firstName ? userToEdit.firstName : ""}
          userId={userToEdit.Id}
        />
        <LastNameForm
          lastName={userToEdit.lastName ? userToEdit.lastName : ""}
          userId={userToEdit.Id}
        />
        <RoleForm role={userToEdit.role} userId={userToEdit.Id} />

        {userToEdit.role === Role.LECTURER && (
          <LectureForm
            workshopToLectureId={
              userToEdit.workshopToLectureId
                ? userToEdit.workshopToLectureId
                : ""
            }
            userId={userToEdit.Id}
            workshops={workshops}
          />
        )}

        {userToEdit.role === Role.USER && (
          <WorkshopForm
            workshopToAttendId={
              userToEdit.workshopToAttendId ? userToEdit.workshopToAttendId : ""
            }
            userId={userToEdit.Id}
            workshops={workshopsPrivate}
          />
        )}
      </div>
    </div>
  );
};

export default UserEditPage;
