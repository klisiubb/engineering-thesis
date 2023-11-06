import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TopicForm } from "./_components/topic-form";
import { DescriptionForm } from "./_components/description-form";
import { RoomForm } from "./_components/room-form";
import { MaxAttendersForm } from "./_components/max-attenders-form";
import StartDateForm from "./_components/start-date-form";
import EndDateForm from "./_components/end-date-form";
import SaveForm from "./_components/save-form";
const CourseIdPage = async ({ params }: { params: { workshopId: string } }) => {
  const workshop = await prisma.workshop.findUnique({
    where: {
      id: params.workshopId,
    },
  });

  if (!workshop) {
    return redirect("/admin/workshop/");
  }

  const requiredFields = [
    workshop.topic,
    workshop.description,
    workshop.room,
    workshop.startDate,
    workshop.endDate,
    workshop.maxAttenders,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Workshop setup:</h1>
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
        {workshop.isPublished ? (
          <></>
        ) : (
          <>
            <TopicForm initialData={workshop} workshopId={workshop.id} />
            <DescriptionForm initialData={workshop} workshopId={workshop.id} />
            <RoomForm initialData={workshop} workshopId={workshop.id} />
            <MaxAttendersForm initialData={workshop} workshopId={workshop.id} />
            <StartDateForm initialData={workshop} workshopId={workshop.id} />
            <EndDateForm initialData={workshop} workshopId={workshop.id} />
          </>
        )}
        {completedFields === totalFields && (
          <SaveForm initialData={workshop} workshopId={workshop.id} />
        )}
      </div>
    </div>
  );
};

export default CourseIdPage;
