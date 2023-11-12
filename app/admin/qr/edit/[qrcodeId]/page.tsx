import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NameForm } from "../../_components/name-form";
import SaveForm from "../../_components/save-form";
import { ValueForm } from "../../_components/value-form";
import { MaxUsesForm } from "../../_components/max-uses-form";
import { WorkshopForm } from "../../_components/workshop-form";
const QRCodeEditPage = async ({ params }: { params: { qrcodeId: string } }) => {
  const qrcode = await prisma.qrCode.findUnique({
    where: {
      id: params.qrcodeId,
    },
  });

  const workshops = await prisma.workshop.findMany({
    where: {
      isPublished: true,
      AND: {
        qrCodeId: null,
      },
    },
  });

  if (!qrcode) {
    return redirect("/admin/qr/");
  }

  const requiredFields = [qrcode.value, qrcode.name];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Button asChild variant="outline">
            <Link href="/admin/qr/">Go back!</Link>
          </Button>
          <h1 className="text-2xl font-medium">QR Code setup:</h1>
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
        {qrcode.isPublished ? (
          <></>
        ) : (
          <>
            <NameForm initialData={qrcode} qrcodeId={qrcode.id} />
            <ValueForm initialData={qrcode} qrcodeId={qrcode.id} />
            <MaxUsesForm initialData={qrcode} qrcodeId={qrcode.id} />
            <WorkshopForm
              qrCodeId={qrcode.id}
              workshopId={qrcode.workshopId ? qrcode.workshopId : ""}
              workshops={workshops}
            />
          </>
        )}
      </div>
      <div className="mt-2">
        {completedFields === totalFields && (
          <SaveForm initialData={qrcode} qrcodeId={qrcode.id} />
        )}
      </div>
    </div>
  );
};

export default QRCodeEditPage;
