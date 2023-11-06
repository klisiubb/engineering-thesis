import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import React from "react"

const Page = async () => {
  const user = await currentUser()
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/")
  }

  return <div> Admin Page</div>
}

export default Page
