import { currentUser } from "@clerk/nextjs";
import { Role, User } from "@prisma/client";
import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

async function getData(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

const Page = async () => {
  const user = await currentUser();

  const data = await getData();
  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  }

  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Users:</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Page;
