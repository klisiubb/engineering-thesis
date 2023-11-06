import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"
import React from "react"
import { redirect } from "next/navigation"
const WorkshopPage = async () => {
  const user = await currentUser()
  if (!user || user.publicMetadata.role !== Role.ADMIN) {
    return redirect("/")
  }
  return <div>Workshop Page</div>
}

export default WorkshopPage
