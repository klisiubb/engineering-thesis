"use client"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { SignOutButton } from "@clerk/nextjs"

export const NavbarRoutes = () => {
  const pathname = usePathname()
  return (
    <>
      <div className="flex gap-x-2 ml-auto">
        <Button size="sm" variant="ghost">
          <SignOutButton />
        </Button>
      </div>
    </>
  )
}
